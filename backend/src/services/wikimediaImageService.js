import axios from "axios";

/**
 * Get a destination image from English Wikipedia/Wikimedia.
 *
 * Example:
 * getWikimediaImage("Tirupati", "Tirupati")
 *
 * Returns:
 * - image URL if a suitable Wikipedia page/image is found
 * - null if no suitable image is found
 */

export const getWikimediaImage = async (
  destinationName,
  city = ""
) => {
  try {
    if (!destinationName) {
      return null;
    }

    const name = destinationName.trim();

    // First try the exact destination name.
    const exactUrl =
      `https://en.wikipedia.org/api/rest_v1/page/summary/` +
      encodeURIComponent(name);

    try {
      const exactResponse = await axios.get(
        exactUrl,
        {
          headers: {
            "User-Agent":
              "IndiaGuideTouristApp/1.0"
          },
          timeout: 10000
        }
      );

      const data = exactResponse.data;

      if (
        data?.thumbnail?.source
      ) {
        console.log(
          `Wikipedia image found: ${name}`
        );

        return data.thumbnail.source;
      }

      if (
        data?.originalimage?.source
      ) {
        console.log(
          `Wikipedia original image found: ${name}`
        );

        return data.originalimage.source;
      }
    } catch (error) {
      // Exact page was not found.
      // We will try a search below.
    }

    // If exact page doesn't have an image,
    // search using destination + city.
    const searchText =
      city && city.trim()
        ? `${name} ${city.trim()} India`
        : `${name} India`;

    const searchUrl =
      "https://en.wikipedia.org/w/rest.php/v1/search/page";

    const searchResponse =
      await axios.get(searchUrl, {
        params: {
          q: searchText,
          limit: 5
        },
        headers: {
          "User-Agent":
            "IndiaGuideTouristApp/1.0"
        },
        timeout: 10000
      });

    const pages =
      searchResponse.data?.pages || [];

    // Look for the most relevant result
    // that actually contains an image.
    for (const page of pages) {
      if (!page.key) {
        continue;
      }

      try {
        const pageUrl =
          `https://en.wikipedia.org/api/rest_v1/page/summary/` +
          encodeURIComponent(page.key);

        const pageResponse =
          await axios.get(pageUrl, {
            headers: {
              "User-Agent":
                "IndiaGuideTouristApp/1.0"
            },
            timeout: 10000
          });

        const pageData =
          pageResponse.data;

        if (
          pageData?.thumbnail?.source
        ) {
          console.log(
            `Wikipedia search image found: ${name} → ${pageData.title}`
          );

          return pageData.thumbnail.source;
        }

        if (
          pageData?.originalimage?.source
        ) {
          console.log(
            `Wikipedia original image found: ${name} → ${pageData.title}`
          );

          return pageData.originalimage.source;
        }
      } catch (error) {
        // Try the next search result.
      }
    }

    console.log(
      `No Wikimedia image found for: ${name}`
    );

    return null;

  } catch (error) {
    console.error(
      `Wikimedia image error for ${destinationName}:`,
      error.response?.data ||
      error.message
    );

    return null;
  }
};
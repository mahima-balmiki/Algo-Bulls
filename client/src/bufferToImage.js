// bufferToImage.js
const bufferToImage = (buffer) => {
  // Convert buffer to Uint8Array
  const uint8Array = new Uint8Array(buffer.data);

  // Create a Blob from the Uint8Array
  const blob = new Blob([uint8Array], { type: "image/png" }); // Change the type as needed

  // Create a data URL from the Blob
  const dataUrl = URL.createObjectURL(blob);

  return dataUrl;
};

export default bufferToImage;

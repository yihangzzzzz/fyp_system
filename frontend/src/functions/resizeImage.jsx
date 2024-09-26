export const ResizeImage = (file) => {
  
  const reader = new FileReader();
    reader.onload = (event) => {
      let resizedFile;
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set the canvas size to 100x100
            canvas.width = 100;
            canvas.height = 100;

            // Draw the image onto the canvas with forced dimensions (no aspect ratio preservation)
            ctx.drawImage(img, 0, 0, 100, 100);

            // Convert canvas to a Blob (file-like object)
            canvas.toBlob((blob) => {
              resizedFile = new File([blob], file.name, { type: blob.type });
              // setNewItem(prevState => ({
              //   ...prevState,
              //   picture: resizedFile  // Replace with the new value for destination
              // }));

                // You can now use `resizedFile` to upload via Axios or any other metho


            }, file.type, 1); // Set quality to 1 (100%)
        };

        return resizedFile
    };

    // Read the image file as Data URL
    return reader.readAsDataURL(file);

};
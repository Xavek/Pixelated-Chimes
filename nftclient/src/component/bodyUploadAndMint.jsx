import React, { useState } from "react";

const UploadForm = () => {
  const [submittedURL, setSubmittedURL] = useState("");
  const [inputs, setInputs] = useState({
    amount: "",
    imageShortUrl: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleImageTest = () => {
    setSubmittedURL(inputs.imageShortUrl);
  };
  const handleFinalUpload = () => {
    console.log(inputs);
    setInputs({ imageShortUrl: "", amount: "" });
    setSubmittedURL("");
  };

  return (
    <div className="flex overflow-hidden mt-2">
      <div className="flex items-center justify-center w-1/2 mx-auto p-4">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-xl my-2">Upload And Mint</h2>
          <label htmlFor="amount" className="mb-2">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="text"
            placeholder="Enter The Amount"
            onChange={handleInputChange}
            value={inputs.amount}
            className="border border-gray-300 rounded-md px-4 py-2 mb-4"
          />
          <label htmlFor="imageShortUrl" className="mb-2">
            Image URL (short)
          </label>
          <input
            id="imageShortUrl"
            name="imageShortUrl"
            type="text"
            placeholder="Enter image URL"
            value={inputs.imageShortUrl}
            onChange={handleInputChange}
            className="border border-gray-300 rounded-md px-4 py-2 mb-4"
          />
          <div className="flex">
            <button
              onClick={handleImageTest}
              className="bg-black text-white px-4 py-2 mx-2 rounded-md w-full"
            >
              Image Test
            </button>

            <button
              onClick={handleFinalUpload}
              className="bg-black text-white px-4 py-2 rounded-md w-full"
            >
              UploadToMint
            </button>
          </div>{" "}
        </div>
      </div>
      <div className="w-1/2">
        <div className="h-full border-l border-gray-300 pl-8">
          {submittedURL && (
            <div className="border border-gray-300 rounded-lg w-400 h-400 overflow-hidden">
              <img
                src={submittedURL}
                alt="Submitted"
                className="w-1/2 h-1/2 object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadForm;
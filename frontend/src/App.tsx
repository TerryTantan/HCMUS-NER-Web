import React, { useState } from "react";
import Header from "./components/common/Header";

function App() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleConvert = () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }
    // Call backend API or perform conversion logic here
    console.log("Converting:", file.name);
  };

  return (
    <>
      <Header />
      <section className="bg-gradient-to-b from-gray-800 to-gray-700 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between space-y-8 md:space-y-0">
          {/* Left content */}
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-4">File Converter</h2>
            <p className="text-lg leading-relaxed">
              CloudConvert is an online file converter. We support nearly all
              audio, video, document, ebook, archive, image, spreadsheet, and
              presentation formats. To get started, use the button below and
              select files to convert from your computer.
            </p>
          </div>

          {/* Right dropdowns */}
          <div className="flex items-center space-x-4">
            <span className="text-lg">convert</span>
            <select
              title="Select format to convert from"
              className="bg-transparent border border-gray-500 px-4 py-2 rounded text-white text-lg"
            >
              <option value="">...</option>
              <option value="jpg">JPG</option>
              <option value="mp4">MP4</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex justify-center mt-10">
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300"
        >
          Select File
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            if (file) {
              console.log("Selected file:", file);
              // TODO: handle upload logic here
            }
          }}
        />
      </div>
      <section className="bg-white border rounded shadow p-6 w-[60%] mx-auto mt-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl font-semibold">
            <span className="inline-block mr-2">🔧</span>OPTIONS
          </span>
        </div>

        <div className="border-t pt-6 space-y-6">
          {/* PII Masking Options */}
          <div>
            <label className="block text-lg font-medium mb-2">
              PII Masking
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>National ID</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Bank Card</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Phone Number</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Home Address</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Facial Image</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Personal Name</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Geographic Location</span>
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Select the sensitive information you want to automatically redact
              or mask.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;

import { useState } from "react";
import Header from "./components/common/Header";
import { FaFileAlt, FaSync, FaWrench, FaTimes } from "react-icons/fa";
import axios from "axios";
import Footer from "./components/common/Footer";

const backend_endpoint = "http://localhost:8000/";

const labelMapping = {
  PERSON: "Personal Name",
  ORGANIZATION: "Organization",
  LOCATION: "Geographic Location",
  PHONE_NUMBER: "Phone Number",
  ADDRESS: "Home Address",
  EMAIL_ADDRESS: "Email Address",
  CREDIT_CARD: "Bank Card",
  URL: "Website URL",
};

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [maskingMode, setMaskingMode] = useState("auto");
  const [selectedLabels, setSelectedLabels] = useState([]);

  const onFileAnalyze = () => {
    const formData = new FormData();
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }
    formData.append("myFile", selectedFile, selectedFile.name);
    console.log("File uploading");
    axios({
      method: "post",
      url: backend_endpoint,
      responseType: "json",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => {
      console.log("File uploaded successfully");
      console.log(response);
      console.log(response.data);
    });
  };
  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setSelectedFile(selectedFile);
    }
  };
  const handleToggle = (key: string[]) => {
    setSelectedLabels((prev) =>
      prev.includes(key)
        ? prev.filter((label) => label !== key)
        : [...prev, key]
    );
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <section className="bg-gradient-to-b from-gray-800 to-gray-700 text-white px-6 py-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between space-y-8 md:space-y-0">
              {/* Left content */}
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold mb-4">PII Masking Tool</h2>
                <p className="text-lg leading-relaxed">
                  Protect sensitive information with our intelligent PII Masking
                  Tool. Effortlessly detect and anonymize personally
                  identifiable data — such as ID numbers, addresses, names, and
                  more — from your documents. Upload a file to get started and
                  safeguard privacy with a single click.
                </p>
              </div>

              {/* Right dropdowns */}
              <div className="flex items-center space-x-4">
                <span className="text-lg">Mask data for</span>
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

          <div
            id="Convert"
            className="flex flex-col items-center mt-10 space-y-6"
          >
            {!selectedFile && (
              <>
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
                  onChange={onFileUpload}
                />

                <div
                  id="HowItWorks"
                  className="w-full flex justify-center mt-16"
                >
                  <div className="w-full max-w-5xl px-6">
                    <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* AI Detection */}
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">🤖</div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            AI-Powered Detection
                          </h3>
                          <p className="text-gray-700">
                            Automatically detect sensitive information in PDFs,
                            DOCs, images (e.g. PNG, JPG), and more using a
                            combination of Regex and NLP (SpaCy). The system can
                            even detect PII within embedded document images like
                            identity cards.
                          </p>
                        </div>
                      </div>

                      {/* Manual + Auto Masking */}
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">🎯</div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            Flexible Masking Options
                          </h3>
                          <p className="text-gray-700">
                            Users can manually select what to redact or rely on
                            pre-configured automatic masking rules. Highlight,
                            mark, or define PII directly from the interface for
                            fine-grained control.
                          </p>
                        </div>
                      </div>

                      {/* Custom Privacy Rules */}
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">⚙️</div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            Custom Privacy Definitions
                          </h3>
                          <p className="text-gray-700">
                            Define what qualifies as personal data based on your
                            own privacy policies or regulatory requirements.
                            Supports dynamic field selection (name, ID number,
                            account info, etc.).
                          </p>
                        </div>
                      </div>

                      {/* Export & Integration */}
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">📁</div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">
                            Export & Format Flexibility
                          </h3>
                          <p className="text-gray-700">
                            Export redacted files in the same format as the
                            original (PDF, DOCX, XLSX, etc.). Seamlessly
                            integrates into existing document workflows with
                            minimal setup required.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedFile && (
              <section className="w-full max-w-4xl px-6">
                <div className="bg-white border rounded shadow flex items-center justify-between p-4 space-x-4">
                  <div className="flex items-center space-x-3">
                    <FaFileAlt className="text-gray-600 text-xl" />
                    <span className="text-gray-800 font-medium truncate max-w-[300px]">
                      {selectedFile.name}
                    </span>
                    <FaSync className="text-gray-500 text-lg cursor-pointer" />
                    <select
                      title="Select PII masking mode"
                      className="border rounded px-3 py-1"
                      value={maskingMode}
                      onChange={(e) => setMaskingMode(e.target.value)}
                    >
                      <option value="auto">Automatic Masking</option>
                      <option value="manual">Let Me Choose What to Mask</option>
                    </select>

                    <button className="border rounded p-1" title="Settings">
                      <FaWrench className="text-gray-600" />
                    </button>
                  </div>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => setSelectedFile(null)}
                    title="Remove file"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition"
                    onClick={onFileAnalyze}
                  >
                    <FaSync className="inline-block mr-2" />
                    Start analyzing
                  </button>
                </div>
                {maskingMode === "auto" && (
                  <div className="bg-white border rounded shadow p-6 w-full mx-auto mt-6">
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
                        <div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(labelMapping).map(
                              ([key, display]) => (
                                <label
                                  key={key}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={selectedLabels.includes(key)}
                                    onChange={() => handleToggle(key)}
                                  />
                                  <span>{display}</span>
                                </label>
                              )
                            )}
                          </div>

                          {/* 👇 Xem thử kết quả hoặc gửi đi khi cần */}
                          <pre className="mt-4 text-sm text-gray-600">
                            Selected labels:{" "}
                            {JSON.stringify(selectedLabels, null, 2)}
                          </pre>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Select the sensitive information you want to
                          automatically redact or mask.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default App;

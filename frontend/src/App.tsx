import React, { useState } from "react";
import Header from "./components/common/Header";
import { FaFileAlt, FaSync, FaWrench, FaTimes } from "react-icons/fa";

function App() {
  const [file, setFile] = useState<File | null>(null);

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
            {!file && (
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
                  onChange={(e) => {
                    const selected = e.target.files && e.target.files[0];
                    if (selected) {
                      setFile(selected);
                    }
                  }}
                />
                <div className="bg-white border rounded shadow p-6 w-[60%] mx-auto mt-6">
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
                        Select the sensitive information you want to
                        automatically redact or mask.
                      </p>
                    </div>
                  </div>
                </div>

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

            {file && (
              <section className="w-full max-w-4xl px-6">
                <div className="bg-white border rounded shadow flex items-center justify-between p-4 space-x-4">
                  <div className="flex items-center space-x-3">
                    <FaFileAlt className="text-gray-600 text-xl" />
                    <span className="text-gray-800 font-medium truncate max-w-[300px]">
                      {file.name}
                    </span>
                    <FaSync className="text-gray-500 text-lg cursor-pointer" />
                    <select
                      title="Select PII masking mode"
                      className="border rounded px-3 py-1"
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
                    onClick={() => setFile(null)}
                    title="Remove file"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="flex justify-end mt-4">
                  <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition">
                    <FaSync className="inline-block mr-2" />
                    Start masking
                  </button>
                </div>
              </section>
            )}
          </div>
        </main>

        <footer
          id="Contact"
          className="bg-gray-100 text-gray-800 px-8 py-12 mt-16 w-full"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h3 className="font-bold mb-2">Project</h3>
              <p>PII Masking Tool</p>
              <a
                href="https://github.com/your-repo-link"
                className="text-red-600 hover:underline"
              >
                View on GitHub
              </a>
            </div>
            <div>
              <h3 className="font-bold mb-2">Team Members</h3>
              <ul className="space-y-1">
                <li>
                  <a
                    href="https://github.com/member1"
                    className="text-red-600 hover:underline"
                  >
                    Member One
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/member2"
                    className="text-red-600 hover:underline"
                  >
                    Member Two
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/member3"
                    className="text-red-600 hover:underline"
                  >
                    Member Three
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/member4"
                    className="text-red-600 hover:underline"
                  >
                    Member Four
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/member5"
                    className="text-red-600 hover:underline"
                  >
                    Member Five
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Contact</h3>
              <p>
                Email:{" "}
                <a
                  href="mailto:yourgroup@example.com"
                  className="text-red-600 hover:underline"
                >
                  yourgroup@example.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Institution</h3>
              <p>University Placeholder</p>
              <p>Course: Secure Programming</p>
            </div>
          </div>
          <div className="text-center text-gray-500 text-sm mt-8">
            © 2025 PII Masking Team. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;

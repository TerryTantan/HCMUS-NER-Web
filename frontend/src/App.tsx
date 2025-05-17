import { useState } from "react";
import Header from "./components/common/Header";
import { FaFileAlt, FaSync, FaWrench, FaTimes } from "react-icons/fa";
import axios from "axios";
import Footer from "./components/common/Footer";

const backend_endpoint = "http://localhost:8100";

const labelMapping = {
  PERSON: "Personal Name",
  ORG: "Organization",
  LOC: "Geographic Location",
  PHONE_NUMBER: "Phone Number",
  ADDRESS: "Home Address",
  EMAIL_ADDRESS: "Email Address",
  CREDIT_CARD: "Bank Card",
  URL: "Website URL",
};
interface AnalysisResult {
  file_path?: string;
  res1?: Array<Array<[string, string, number, number]>>;
  res2?: Array<string>;
  flag: boolean;
}

const emptyResult = {
  file_path: undefined,
  res1: undefined,
  res2: undefined,
  flag: false,
};

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [maskingMode, setMaskingMode] = useState("auto");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMasking, setIsMasking] = useState(false);

  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult>(emptyResult);

  const [selectedRows, setSelectedRows] = useState<Record<number, Set<number>>>(
    {}
  );

  const toggleRowSelection = (pageIndex: number, rowIndex: number) => {
    setSelectedRows((prev) => {
      const currentSet = prev[pageIndex] || new Set();
      const newSet = new Set(currentSet);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return { ...prev, [pageIndex]: newSet };
    });
  };

  const toggleSelectAllInPage = (pageIndex: number, totalItems: number) => {
    setSelectedRows((prev) => {
      const currentSet = prev[pageIndex] || new Set();
      const newSet = new Set(currentSet);

      if (newSet.size === totalItems) {
        // Bỏ chọn hết nếu đã chọn hết rồi
        return { ...prev, [pageIndex]: new Set() };
      } else {
        // Chọn hết
        const all = new Set<number>();
        for (let i = 0; i < totalItems; i++) {
          all.add(i);
        }
        return { ...prev, [pageIndex]: all };
      }
    });
  };

  const getFilteredRes1 = () => {
    if (!analysisResult.res1) return [];

    return analysisResult.res1.map((pageItems, pageIndex) => {
      const selectedSet = selectedRows[pageIndex] || new Set();
      return pageItems.filter((_, itemIndex) => selectedSet.has(itemIndex));
    });
  };

  const getFilteredRes2 = () => {
    return analysisResult.res2;
  };

  const onFileMasking = () => {
    setIsMasking(true); // ← Bắt đầu phân tích

    const filteredRes1 = getFilteredRes1();
    const filteredRes2 = getFilteredRes2();

    const payload = {
      file_path: analysisResult.file_path,
      res1: filteredRes1,
      res2: filteredRes2,
    };

    console.log("Masking payload", payload);

    axios
      .post(backend_endpoint + "/pii/mask", payload)
      .then((response) => {
        console.log("Masking success", response.data);
        // xử lý tiếp nếu cần
      })
      .catch((error) => {
        console.error("Masking failed", error);
      })
      .finally(() => {
        setIsMasking(false); // ← Kết thúc
      });
  };

  const onFileAnalyze = () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    setIsAnalyzing(true); // ← Bắt đầu phân tích

    const formData = new FormData();
    formData.append("myFile", selectedFile, selectedFile.name);
    console.log("File uploading");

    axios({
      method: "post",
      url: backend_endpoint + "/pii/analyze",
      responseType: "json",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log("File uploaded successfully");
        console.log(response.data);
        setAnalysisResult(response.data); // ← Cập nhật kết quả
      })
      .catch((error) => {
        console.error("Upload failed", error);
      })
      .finally(() => {
        setIsAnalyzing(false); // ← Kết thúc
      });
  };

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setSelectedFile(selectedFile);
    }
  };

  const handleToggle = (key: string) => {
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
                    onClick={() => {
                      setSelectedFile(null);
                      setAnalysisResult(emptyResult);
                    }}
                    title="Remove file"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={
                      analysisResult.res1 ? onFileMasking : onFileAnalyze
                    }
                    disabled={analysisResult.res1 ? isMasking : isAnalyzing}
                  >
                    <FaSync className="inline-block mr-2" />
                    {analysisResult.res1 ? "Start masking" : "Start analyzing"}
                  </button>
                </div>

                {maskingMode === "auto" &&
                  !analysisResult.res1 &&
                  !isAnalyzing && (
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
                {isAnalyzing && (
                  <div className="flex justify-center items-center mt-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
                    <span className="ml-4 text-lg font-medium">
                      Analyzing...
                    </span>
                  </div>
                )}

                {analysisResult?.res1 && (
                  <div className="bg-white border rounded shadow p-6 w-full mx-auto mt-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">
                      Analysis Result
                    </h3>
                    <div className="space-y-6">
                      {analysisResult.res1.map(
                        (
                          pageItems: [string, string, number, number][],
                          pageIndex: number
                        ) => (
                          <div key={pageIndex}>
                            <h4 className="text-lg font-semibold mb-2 flex items-center gap-4">
                              Page {pageIndex + 1}
                              {maskingMode !== "auto" &&
                                pageItems.length > 0 && (
                                  <label className="inline-flex items-center text-sm font-normal">
                                    <input
                                      type="checkbox"
                                      className="mr-2"
                                      checked={
                                        selectedRows[pageIndex]?.size ===
                                          pageItems.length &&
                                        pageItems.length > 0
                                      }
                                      onChange={() =>
                                        toggleSelectAllInPage(
                                          pageIndex,
                                          pageItems.length
                                        )
                                      }
                                    />
                                    Select all
                                  </label>
                                )}
                            </h4>
                            {pageItems.length === 0 ? (
                              <p className="text-gray-500 italic">
                                No PII found on this page.
                              </p>
                            ) : (
                              <table className="w-full table-auto border">
                                <thead>
                                  <tr className="bg-gray-100">
                                    {maskingMode !== "auto" && (
                                      <th className="border px-3 py-2">
                                        Select
                                      </th>
                                    )}
                                    <th className="border px-3 py-2 text-left">
                                      Text
                                    </th>
                                    <th className="border px-3 py-2 text-left">
                                      Type
                                    </th>
                                    <th className="border px-3 py-2 text-left">
                                      Start
                                    </th>
                                    <th className="border px-3 py-2 text-left">
                                      End
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {pageItems.map(
                                    (
                                      item: [string, string, number, number],
                                      idx: number
                                    ) => (
                                      <tr
                                        key={idx}
                                        className="hover:bg-gray-50"
                                      >
                                        {maskingMode !== "auto" && (
                                          <td className="border px-3 py-2 text-center">
                                            <input
                                              type="checkbox"
                                              title="Select this row"
                                              checked={
                                                selectedRows[pageIndex]?.has(
                                                  idx
                                                ) || false
                                              }
                                              onChange={() =>
                                                toggleRowSelection(
                                                  pageIndex,
                                                  idx
                                                )
                                              }
                                            />
                                          </td>
                                        )}
                                        <td className="border px-3 py-2">
                                          {item[0]}
                                        </td>
                                        <td className="border px-3 py-2">
                                          {labelMapping[
                                            item[1] as keyof typeof labelMapping
                                          ] || item[1]}
                                        </td>
                                        <td className="border px-3 py-2">
                                          {item[2]}
                                        </td>
                                        <td className="border px-3 py-2">
                                          {item[3]}
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            )}
                          </div>
                        )
                      )}
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

import React from "react";

export default function Footer() {
  return (
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
  );
}

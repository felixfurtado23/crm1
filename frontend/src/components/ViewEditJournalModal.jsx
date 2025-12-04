import React, { useState, useEffect } from "react";

const ViewEditJournalModal = ({ journal, type, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    journalNumber: "",
    notes: "",
    currency: "AED",
    entries: [
      { account: "", description: "", debit: "", credit: "" },
      { account: "", description: "", debit: "", credit: "" },
    ],
    attachments: [],
  });
  const [accounts, setAccounts] = useState([]);
  const [currencies] = useState(["AED", "USD", "EUR", "GBP", "JPY", "CAD"]);
  const API_BASE_URL = "http://72.61.171.226:8000";

  useEffect(() => {
    fetchAccounts();
    if (journal && type !== "create") {
      setFormData({
        ...journal,
        date: journal.date.split("T")[0],
      });
    } else if (type === "create") {
      generateJournalNumber();
    }
  }, [journal, type]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chart-of-accounts/`);
      if (response.ok) {
        const data = await response.json();
        setAccounts(data);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const generateJournalNumber = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/manual-journals/last-number/`
      );
      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          journalNumber: data.lastNumber + 1,
        }));
      }
    } catch (error) {
      console.error("Error generating journal number:", error);
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "";
    const number = parseFloat(num);
    if (isNaN(number)) return "";
    return number.toLocaleString();
  };

  const parseFormattedNumber = (str) => {
    return str.replace(/,/g, "");
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEntryChange = (index, field, value) => {
    const updatedEntries = [...formData.entries];

    if (field === "debit" || field === "credit") {
      // Format number with commas
      const cleanedValue = parseFormattedNumber(value);
      updatedEntries[index] = {
        ...updatedEntries[index],
        [field]: cleanedValue,
      };

      // Auto-clear the opposite field when one is filled
      if (field === "debit" && cleanedValue) {
        updatedEntries[index].credit = "";
      } else if (field === "credit" && cleanedValue) {
        updatedEntries[index].debit = "";
      }
    } else {
      updatedEntries[index] = {
        ...updatedEntries[index],
        [field]: value,
      };
    }

    setFormData((prev) => ({
      ...prev,
      entries: updatedEntries,
    }));
  };

  const addEntry = () => {
    setFormData((prev) => ({
      ...prev,
      entries: [
        ...prev.entries,
        { account: "", description: "", debit: "", credit: "" },
      ],
    }));
  };

  const removeEntry = (index) => {
    if (formData.entries.length > 1) {
      const updatedEntries = formData.entries.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        entries: updatedEntries,
      }));
    }
  };

  const calculateTotals = () => {
    const totalDebits = formData.entries.reduce(
      (sum, entry) => sum + parseFloat(entry.debit || 0),
      0
    );
    const totalCredits = formData.entries.reduce(
      (sum, entry) => sum + parseFloat(entry.credit || 0),
      0
    );
    const difference = totalDebits - totalCredits;

    return {
      totalDebits,
      totalCredits,
      difference,
      isBalanced: Math.abs(difference) < 0.01, // Allow for floating point precision
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totals = calculateTotals();

    if (!totals.isBalanced) {
      alert("Journal entries must balance! Debits must equal Credits.");
      return;
    }

    if (formData.entries.some((entry) => !entry.account)) {
      alert("All entries must have an account selected.");
      return;
    }

    try {
      const url =
        type === "create"
          ? `${API_BASE_URL}/api/manual-journals/create/`
          : `${API_BASE_URL}/api/manual-journals/${journal.id}/update/`;

      const method = type === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          `Journal ${type === "create" ? "created" : "updated"} successfully!`
        );
        onSave();
        onClose();
      } else {
        alert(`Error ${type === "create" ? "creating" : "updating"} journal`);
      }
    } catch (error) {
      console.error(
        `Error ${type === "create" ? "creating" : "updating"} journal:`,
        error
      );
      alert(
        `Error ${type === "create" ? "creating" : "updating"} journal: ` +
          error.message
      );
    }
  };

  const totals = calculateTotals();

  return (
    <div className="modal-overlay active">
      <div
        className="modal-content"
        style={{ maxWidth: "1130px", margin: "0 auto" }}
      >
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">
              {type === "create"
                ? "Add New Journal"
                : type === "edit"
                ? "Edit Journal"
                : "Journal Details"}
            </h2>
            <p className="modal-subtitle">
              {type === "create"
                ? "Fill the details to add a new journal entry"
                : type === "edit"
                ? "Edit journal entry details"
                : "View journal entry details"}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className="modal-body"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            {/* Basic Information */}
            <div className="modal-form-section">
              <h4>Basic Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    disabled={type === "view"}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Journal Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`JRN-${formData.journalNumber
                      .toString()
                      .padStart(4, "0")}`}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    className="form-control"
                    value={formData.currency}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    disabled={type === "view"}
                    required
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  disabled={type === "view"}
                  placeholder="Enter journal notes..."
                />
              </div>
            </div>

            {/* Journal Entries */}
            <div className="modal-form-section">
              <div className="expense-section-header">
                <h4>Journal Entries</h4>
                {type !== "view" && (
                  <button
                    type="button"
                    className="btn btn-outline with-icon"
                    onClick={addEntry}
                  >
                    <i className="fas fa-plus"></i>
                    Add Entry
                  </button>
                )}
              </div>

              <div
                className="expense-entries-table-container"
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #e9ecef",
                  borderRadius: "8px",
                }}
              >
                <table
                  className="expense-entries-table"
                  style={{ tableLayout: "fixed", width: "100%" }}
                >
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      background: "#f8f9fa",
                      zIndex: 10,
                    }}
                  >
                    <tr>
                      <th style={{ width: "30%" }}>Account</th>
                      <th style={{ width: "30%" }}>Description</th>
                      <th style={{ width: "15%" }} className="text-right">
                        Debit
                      </th>
                      <th style={{ width: "15%" }} className="text-right">
                        Credit
                      </th>
                      {type !== "view" && <th style={{ width: "10%" }}></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {formData.entries.map((entry, index) => (
                      <tr key={index} className="expense-entry-row">
                        <td>
                          <select
                            className="expense-form-control expense-account-select"
                            value={entry.account}
                            onChange={(e) =>
                              handleEntryChange(
                                index,
                                "account",
                                e.target.value
                              )
                            }
                            disabled={type === "view"}
                            required
                            style={{ width: "100%" }}
                          >
                            <option value="">Select Account</option>
                            {accounts.map((account) => (
                              <option key={account.id} value={account.id}>
                                {account.accountCode} - {account.accountName}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <textarea
                            className="expense-form-control"
                            value={entry.description}
                            onChange={(e) =>
                              handleEntryChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            disabled={type === "view"}
                            placeholder="Enter description"
                            rows={2}
                            style={{
                              width: "100%",
                              minHeight: "60px",
                              resize: "vertical",
                              fontFamily: "inherit",
                              fontSize: "14px",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="expense-form-control text-right"
                            value={formatNumber(entry.debit)}
                            onChange={(e) =>
                              handleEntryChange(index, "debit", e.target.value)
                            }
                            disabled={type === "view"}
                            placeholder="0.00"
                            style={{
                              fontFamily: "'Courier New', monospace",
                              fontWeight: "600",
                              textAlign: "right",
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            className="expense-form-control text-right"
                            value={formatNumber(entry.credit)}
                            onChange={(e) =>
                              handleEntryChange(index, "credit", e.target.value)
                            }
                            disabled={type === "view"}
                            placeholder="0.00"
                            style={{
                              fontFamily: "'Courier New', monospace",
                              fontWeight: "600",
                              textAlign: "right",
                            }}
                          />
                        </td>
                        {type !== "view" && formData.entries.length > 1 && (
                          <td>
                            <button
                              type="button"
                              className="expense-btn-remove-entry"
                              onClick={() => removeEntry(index)}
                              style={{
                                width: "32px",
                                height: "32px",
                                border: "none",
                                background: "#ffebee",
                                color: "#d32f2f",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                margin: "0 auto",
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = "#d32f2f";
                                e.target.style.color = "white";
                                e.target.style.transform = "scale(1.1)";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background = "#ffebee";
                                e.target.style.color = "#d32f2f";
                                e.target.style.transform = "scale(1)";
                              }}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <br></br>

              <div className="modal-form-section">
                <h4
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <i
                    className="fas fa-paperclip"
                    style={{ color: "#667eea" }}
                  ></i>
                  Attachments
                </h4>

                <div
                  className="attachments-list"
                  style={{
                    marginTop: "0",
                  }}
                >
                  {/* Header with Add Attachment Button */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#e0e7ff",
                          color: "#4f46e5",
                          fontSize: "14px",
                          fontWeight: "600",
                          padding: "4px 12px",
                          borderRadius: "12px",
                        }}
                      >
                        {formData.attachments?.length || 0} files
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                      onClick={() => {
                        // Trigger file input click
                        const fileInput = document.createElement("input");
                        fileInput.type = "file";
                        fileInput.multiple = true;
                        fileInput.onchange = (e) => {
                          const files = Array.from(e.target.files);
                          // Handle file upload logic here
                          console.log("Files selected:", files);
                        };
                        fileInput.click();
                      }}
                    >
                      <i className="fas fa-plus"></i>
                      Add Attachment
                    </button>
                  </div>

                  {/* Attachments Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(350px, 1fr))",
                      gap: "16px",
                      minHeight: "200px",
                    }}
                  >
                    {/* Default "Open Folder" Card */}
                    <div
                      className="attachment-folder-card"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "32px 24px",
                        backgroundColor: "white",
                        borderRadius: "16px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                        border: "2px dashed #d1d5db",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        minHeight: "180px",
                      }}
                      onClick={() => {
                        // Open folder or trigger file selection
                        const fileInput = document.createElement("input");
                        fileInput.type = "file";
                        fileInput.multiple = true;
                        fileInput.onchange = (e) => {
                          const files = Array.from(e.target.files);
                          // Handle file upload logic here
                          console.log("Files selected:", files);
                        };
                        fileInput.click();
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 32px rgba(0, 0, 0, 0.15)";
                        e.currentTarget.style.borderColor = "#667eea";
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 20px rgba(0, 0, 0, 0.08)";
                        e.currentTarget.style.borderColor = "#d1d5db";
                        e.currentTarget.style.backgroundColor = "white";
                      }}
                    >
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          borderRadius: "16px",
                          marginBottom: "20px",
                          boxShadow: "0 6px 20px rgba(102, 126, 234, 0.3)",
                        }}
                      >
                        <i
                          className="fas fa-folder-open"
                          style={{
                            color: "white",
                            fontSize: "28px",
                            filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))",
                          }}
                        ></i>
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1f2937",
                          marginBottom: "8px",
                          textAlign: "center",
                        }}
                      >
                        Open Folder
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          textAlign: "center",
                          lineHeight: "1.4",
                        }}
                      >
                        Click to browse files or drag & drop
                      </div>
                    </div>

                    {/* Sample Attachment Cards */}
                    <div
                      className="attachment-item"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "20px",
                        backgroundColor: "white",
                        borderRadius: "16px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                        border: "1px solid #e8e9eb",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        cursor: "pointer",
                        minHeight: "180px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 32px rgba(0, 0, 0, 0.15)";
                        e.currentTarget.style.borderColor = "#d1d5db";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 20px rgba(0, 0, 0, 0.08)";
                        e.currentTarget.style.borderColor = "#e8e9eb";
                      }}
                    >
                      <div
                        className="attachment-icon"
                        style={{
                          width: "60px",
                          height: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          borderRadius: "12px",
                          marginRight: "20px",
                          boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
                          flexShrink: 0,
                        }}
                      >
                        <i
                          className="fas fa-file-pdf"
                          style={{
                            color: "white",
                            fontSize: "24px",
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                          }}
                        ></i>
                      </div>
                      <div
                        className="attachment-info"
                        style={{
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <div
                          className="attachment-name"
                          style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            color: "#1f2937",
                            marginBottom: "8px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          journal_attachment_001.pdf
                        </div>
                        <div
                          className="attachment-meta"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              className="attachment-size"
                              style={{
                                fontSize: "14px",
                                color: "#6b7280",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <i
                                className="fas fa-hdd"
                                style={{ fontSize: "12px", opacity: 0.7 }}
                              ></i>
                              2.4 MB
                            </div>
                            <div
                              className="attachment-date"
                              style={{
                                fontSize: "14px",
                                color: "#9ca3af",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <i
                                className="far fa-clock"
                                style={{ fontSize: "12px", opacity: 0.7 }}
                              ></i>
                              Today
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                backgroundColor: "#f3f4f6",
                                color: "#6b7280",
                                fontSize: "12px",
                                padding: "4px 10px",
                                borderRadius: "12px",
                                fontWeight: "500",
                              }}
                            >
                              PDF
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          marginLeft: "12px",
                        }}
                      >
                        <button
                          className="attachment-download"
                          title="Download attachment"
                          style={{
                            background: "transparent",
                            border: "1px solid #d1d5db",
                            color: "#4b5563",
                            cursor: "pointer",
                            padding: "10px",
                            borderRadius: "10px",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "44px",
                            height: "44px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                            e.currentTarget.style.borderColor = "#9ca3af";
                            e.currentTarget.style.color = "#1f2937";
                            e.currentTarget.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.borderColor = "#d1d5db";
                            e.currentTarget.style.color = "#4b5563";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            alert("Downloading file...");
                          }}
                        >
                          <i
                            className="fas fa-download"
                            style={{ fontSize: "16px" }}
                          ></i>
                        </button>
                        <button
                          className="attachment-delete"
                          title="Remove attachment"
                          style={{
                            background: "transparent",
                            border: "1px solid #fca5a5",
                            color: "#ef4444",
                            cursor: "pointer",
                            padding: "10px",
                            borderRadius: "10px",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "44px",
                            height: "44px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#fef2f2";
                            e.currentTarget.style.borderColor = "#f87171";
                            e.currentTarget.style.color = "#dc2626";
                            e.currentTarget.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.borderColor = "#fca5a5";
                            e.currentTarget.style.color = "#ef4444";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                "Are you sure you want to remove this attachment?"
                              )
                            ) {
                              alert("Attachment removed");
                            }
                          }}
                        >
                          <i
                            className="fas fa-trash"
                            style={{ fontSize: "16px" }}
                          ></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Drag & Drop Zone */}
                  <div
                    style={{
                      marginTop: "24px",
                      padding: "32px",
                      backgroundColor: "#f8fafc",
                      border: "2px dashed #cbd5e1",
                      borderRadius: "12px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#667eea";
                      e.currentTarget.style.backgroundColor = "#f0f7ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#cbd5e1";
                      e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onClick={() => {
                      const fileInput = document.createElement("input");
                      fileInput.type = "file";
                      fileInput.multiple = true;
                      fileInput.click();
                    }}
                  >
                    <i
                      className="fas fa-cloud-upload-alt"
                      style={{
                        fontSize: "48px",
                        color: "#94a3b8",
                        marginBottom: "16px",
                      }}
                    ></i>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#334155",
                        marginBottom: "8px",
                      }}
                    >
                      Drag & drop files here
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#64748b",
                      }}
                    >
                      or click to browse (PDF, DOC, JPG, PNG up to 10MB)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Totals Section */}
            <div
              className="totals-section"
              style={{
                background: totals.isBalanced ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${
                  totals.isBalanced ? "#86efac" : "#fca5a5"
                }`,
                borderRadius: "8px",
                padding: "20px",
                marginTop: "20px",
              }}
            >
              <div
                className="total-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  fontSize: "15px",
                }}
              >
                <span style={{ fontWeight: "600" }}>Total Debits:</span>
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontWeight: "700",
                    color: "#2e7d32",
                  }}
                >
                  {formatNumber(totals.totalDebits)}
                </span>
              </div>
              <div
                className="total-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  fontSize: "15px",
                }}
              >
                <span style={{ fontWeight: "600" }}>Total Credits:</span>
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontWeight: "700",
                    color: "#d32f2f",
                  }}
                >
                  {formatNumber(totals.totalCredits)}
                </span>
              </div>
              <div
                className="total-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  fontSize: "15px",
                }}
              >
                <span style={{ fontWeight: "600" }}>Difference:</span>
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontWeight: "700",
                    color: totals.difference === 0 ? "#2e7d32" : "#d32f2f",
                  }}
                >
                  {formatNumber(totals.difference)}
                </span>
              </div>
              <div
                className="total-row final"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: "16px",
                  borderTop: "2px solid #e5e7eb",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                <span>Status:</span>
                <span
                  style={{
                    color: totals.isBalanced ? "#2e7d32" : "#d32f2f",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    background: totals.isBalanced ? "#e8f5e9" : "#ffebee",
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {totals.isBalanced ? "✓ BALANCED" : "✗ UNBALANCED"}
                </span>
              </div>
            </div>
          </div>

          <div
            className="form-footer"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
              padding: "20px 28px",
              background: "#f8fafc",
              borderTop: "1px solid #e9ecef",
              borderRadius: "0 0 16px 16px",
            }}
          >
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              style={{
                background: "transparent",
                border: "2px solid #9ca3af",
                color: "#6b7280",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                minWidth: "120px",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#f8f9fa";
                e.target.style.borderColor = "#6b7280";
                e.target.style.color = "#4b5563";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.borderColor = "#9ca3af";
                e.target.style.color = "#6b7280";
              }}
            >
              Cancel
            </button>

       

            {type !== "view" && (
              <button
                type="submit"
                className="btn"
                style={{
                  background:
                    "linear-gradient(135deg, var(--blue-2), var(--blue-1))",
                  border: "none",
                  color: "white",
                  padding: "12px 28px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  minWidth: "140px",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, #2a4452, #375b6d)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background =
                    "linear-gradient(135deg, var(--blue-2), var(--blue-1))";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                {type === "create" ? "Create Journal" : "Update Journal"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewEditJournalModal;

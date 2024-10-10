import React, { useState, useEffect } from "react";
import pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from "pdfmake/build/pdfmake";

import axios from "axios";


pdfMake.vfs = pdfFonts.pdfMake.vfs;


const BillMaker = () => {
  const [items, setItems] = useState([{ name: "", price: "", quantity: 1, size: "" }]);
  const [customerName, setCustomerName] = useState("");
  const [total, setTotal] = useState(0);
  const [companyName] = useState("M. Yaseen Kitchen Engineering");
  const [logoBase64, setLogoBase64] = useState("");

  useEffect(() => {
    const getBase64ImageFromUrl = async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network response was not ok");
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Error fetching image:", error);
        return null; // return null in case of an error
      }
    };

    getBase64ImageFromUrl("/Logo.png").then((base64) => {
      if (base64) {
        setLogoBase64(base64);
      } else {
        console.error("Failed to convert logo to Base64");
      }
    });
  }, []);

  const handleDownloadPDF = () => {
    const docDefinition = {
      content: [
        // Header Section with Logo and Title
        {
          columns: [
            {
              image: logoBase64,
              width: 80,
              margin: [0, 0, 0, 0],
            },
            {
              stack: [
                { text: "INVOICE", style: "invoiceTitle", alignment: "right" },
                { text: "Touch & Touch", style: "companyName", alignment: "right" },
                { text: "INVOICE NO: 1234", style: "invoiceSubheader", alignment: "right" },
                { text: "17th May, 2023", style: "invoiceSubheader", alignment: "right" },
              ],
            },
          ],
          margin: [0, 0, 0, 30],
        },
  
        // Customer and Invoice Information
        {
          columns: [
            [
              { text: `Invoice to:`, style: "customerLabel" },
              { text: customerName, style: "customerName" },
              { text: "hello@reallygreatsite.com", style: "customerDetails" },
              { text: "123 Anywhere St., Any City, ST 12345", style: "customerDetails" },
            ],
            {},
          ],
          margin: [0, 0, 0, 20],
        },
  
        // Table Section
        {
          table: {
            headerRows: 1,
            widths: ["*", "auto", "auto", "auto", "auto"], // Adjusted widths to match the new column order
            body: [
              [
                { text: "Item", style: "tableHeader", alignment: "center" },     // First column: Item Name
                { text: "Price", style: "tableHeader", alignment: "center" },    // Second column: Price
                { text: "Size", style: "tableHeader", alignment: "center" },     // Third column: Size
                { text: "Qty", style: "tableHeader", alignment: "center" },      // Fourth column: Quantity
                { text: "Total", style: "tableHeader", alignment: "center" },    // Fifth column: Subtotal (Total Price)
              ],
              ...items.map((item) => [
                { text: item.name, alignment: "center" },                       // First column: Item Name
                { text: Number(item.price).toFixed(2), alignment: "center" },   // Second column: Price
                { text: item.size, alignment: "center" },                       // Third column: Size
                { text: item.quantity.toString(), alignment: "center" },        // Fourth column: Quantity
                { text: (Number(item.price) * item.quantity).toFixed(2), alignment: "center" }, // Fifth column: Subtotal (Total Price)
              ]),
              [
                { text: "Total", colSpan: 4, alignment: "right", bold: true },  // Footer: Span across 4 columns
                {},
                {},
                {},
                { text: total.toFixed(2), alignment: "center", bold: true },    // Final Total
              ],
            ],
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? "#003366" : null),
            textColor: (rowIndex) => (rowIndex === 0 ? "white" : "black"),
            paddingLeft: () => 10,
            paddingRight: () => 10,
            paddingTop: () => 5,
            paddingBottom: () => 5,
          },
          margin: [0, 20, 0, 20],
        },
  
        // Payment Details Section
        {
          columns: [
            {
              stack: [
                { text: "PAYMENT DETAILS:", style: "paymentLabel" },
                { text: "Account Number:   6001-0104703054", style: "paymentDetails" },
                { text: "Account Title:   Mudasir Yaseen", style: "paymentDetails" },
                { text: "Bank Name:   Meezan Bank", style: "paymentDetails" },
              ],
            },
            {
              stack: [
                {
                  table: {
                    widths: ["*", "auto"],
                    body: [
                      [
                        { text: "Subtotal", alignment: "right", bold: true },
                        { text: total.toFixed(2), alignment: "right" },
                      ],
                      [
                        { text: "TOTAL", alignment: "right", bold: true, color: "#003366" },
                        { text: (total).toFixed(2), alignment: "right", bold: true, color: "#003366" },
                      ],
                    ],
                  },
                  layout: "noBorders",
                },
              ],
              alignment: "right",
            },
          ],
          margin: [0, 20, 0, 20],
        },
  
        // Footer Section with Contact Info
        {
          columns: [
            {
              stack: [
                { text: "CONTACT US", style: "footerHeader" },
                { text: "0301-7775088", style: "footerDetails" },
                { text: "m.yaseenkitchenengineering.com", style: "footerDetails" },
                { text: "Near General bus stannd, Lodhran, 59320", style: "footerDetails" },
              ],
            },
            {
              text: "Thank You!",
              style: "thankYouText",
              alignment: "right",
            },
          ],
          margin: [0, 30, 0, 0],
        },
      ],
  
      // Styles
      styles: {
        invoiceTitle: {
          fontSize: 20,
          bold: true,
          color: "#003366",
        },
        companyName: {
          fontSize: 14,
          bold: true,
          color: "#003366",
        },
        invoiceSubheader: {
          fontSize: 10,
          color: "#777777",
        },
        customerLabel: {
          fontSize: 12,
          bold: true,
          color: "#003366",
        },
        customerName: {
          fontSize: 14,
          bold: true,
        },
        customerDetails: {
          fontSize: 10,
          color: "#777777",
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: "white",
        },
        paymentLabel: {
          bold: true,
          margin: [0, 0, 0, 10],
          fontSize: 12,
        },
        paymentDetails: {
          fontSize: 10,
        },
        footerHeader: {
          fontSize: 12,
          bold: true,
          color: "#003366",
        },
        footerDetails: {
          fontSize: 10,
          margin: [0, 5, 0, 5],
        },
        thankYouText: {
          fontSize: 16,
          bold: true,
          color: "#003366",
        },
      },
    };
  
    pdfMake.createPdf(docDefinition).download("bill.pdf");
  };
  
  
  
  useEffect(() => {
    const calculatedTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(calculatedTotal);
  }, [items]);

  const addItem = () => {
    setItems([...items, { name: "", price: "", quantity: 1, size: "" }]);
  };

  const deleteItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const handleSaveBill = async () => {
    const billData = {
      customerName,
      items,
      total,
    };
  
    try {
      const response = await axios.post("http://localhost:3002/bill/create", billData); // Corrected URL
      if (response.status === 201) { // Check for 202 Created status
        alert("Bill saved successfully!");
      }
    } catch (error) {
      console.error("Error saving bill:", error.response?.data || error.message); // Enhanced error logging
      alert("Failed to save bill.");
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Bill Maker</h2>

      <div className="mb-6">
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer Name"
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-2 sm:px-6 text-left">Item Name</th>
              <th className="py-3 px-2 sm:px-6 text-left">Price</th>
              <th className="py-3 px-2 sm:px-6 text-left">Size</th>
              <th className="py-3 px-2 sm:px-6 text-left">Quantity</th>
              <th className="py-3 px-2 sm:px-6 text-left">Total Price</th>
              <th className="py-3 px-2 sm:px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {items.map((item, index) => (
              <tr className="border-b border-gray-200" key={index}>
                <td className="py-3 px-2 sm:px-6 text-left whitespace-nowrap">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].name = e.target.value;
                      setItems(newItems);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </td>
                <td className="py-3 px-2 sm:px-6 text-left">
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].price = e.target.value;
                      setItems(newItems);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    min="0"
                  />
                </td>
                <td className="py-3 px-2 sm:px-6 text-left">
                  <input
                    type="text"
                    value={item.size}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].size = e.target.value;
                      setItems(newItems);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </td>
                <td className="py-3 px-2 sm:px-6 text-left">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...items];
                      newItems[index].quantity = e.target.value;
                      setItems(newItems);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                    min="1"
                  />
                </td>
                <td className="py-3 px-2 sm:px-6 text-left">
                  {(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="py-3 px-2 sm:px-6 text-left">
                  <button
                    onClick={() => deleteItem(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addItem}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Add Item
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Download Bill
        </button>

        <button
          onClick={handleSaveBill}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg"
        >
          Save Bill
        </button>
      </div>
    </div>
  );
};

export default BillMaker;

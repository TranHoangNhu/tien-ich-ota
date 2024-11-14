// TinhKEI.jsx
"use client";
import { useState } from "react";
import { Button, Table, Upload, Dropdown } from "antd";
import {
  UploadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "antd/dist/reset.css";

export default function TinhKEI() {
  const [data, setData] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);

  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const tableData = jsonData.slice(1).map((row, index) => ({
        key: index,
        keyword: row[0],
        searchVolume: row[1],
        numOfResults: row[2],
        kei: row[2] ? ((row[1] * row[1]) / row[2]).toFixed(2) : 0,
        rating: row[2]
          ? (row[1] * row[1]) / row[2] > 100
            ? "High"
            : (row[1] * row[1]) / row[2] > 10
            ? "Medium"
            : "Low"
          : "Low",
      }));
      setData(tableData);
    };
    reader.readAsBinaryString(file);
    return false;
  };

  const handleSort = () => {
    const sortedData = [...data].sort((a, b) =>
      sortAscending ? a.kei - b.kei : b.kei - a.kei
    );
    setData(sortedData);
    setSortAscending(!sortAscending);
  };

  const exportToXLSX = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ["Keyword", "KEI", "Keyword Rating"],
      ...data.map((row) => [row.keyword, row.kei, row.rating]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "KEI Data");
    XLSX.writeFile(workbook, "export.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const tableColumn = ["Keyword", "KEI", "Keyword Rating"];
    const tableRows = data.map((row) => [
      removeVietnameseTones(row.keyword),
      row.kei,
      removeVietnameseTones(row.rating),
    ]);

    doc.text("KEI Data", 10, 10);
    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("export.pdf");
  };

  const columns = [
    {
      title: "Keyword",
      dataIndex: "keyword",
      key: "keyword",
    },
    {
      title: "Volume",
      dataIndex: "searchVolume",
      key: "searchVolume",
    },
    {
      title: "Number of Results",
      dataIndex: "numOfResults",
      key: "numOfResults",
    },
    {
      title: (
        <div onClick={handleSort} style={{ cursor: "pointer" }}>
          KEI {sortAscending ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        </div>
      ),
      dataIndex: "kei",
      key: "kei",
    },
    {
      title: "Keyword Rating",
      dataIndex: "rating",
      key: "rating",
    },
  ];

  const items = [
    {
      key: "1",
      label: <div onClick={exportToXLSX}>Xuất File Excel</div>,
    },
    {
      key: "2",
      label: <div onClick={exportToPDF}>Xuất File PDF</div>,
    },
  ];

  return (
    <div className="container">
      <h2 className="mb-4">KEI Calculator</h2>
      <Upload beforeUpload={handleFileUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />}>Tải lên file</Button>
      </Upload>
      <Dropdown menu={{ items }} placement="bottomRight" arrow>
        <Button className="mt-3">Xuất File</Button>
      </Dropdown>
      <Table
        className="mt-3"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </div>
  );
}

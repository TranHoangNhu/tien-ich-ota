// Dexuattukhoa.jsx
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import style của QuillJS
import { Button, Input } from "antd"; // Sử dụng nút của Ant Design
import { CodeOutlined, EditOutlined } from "@ant-design/icons"; // Import các icon

export default function Dexuattukhoa() {
  const [content, setContent] = useState("<p>Nhập nội dung tại đây...</p>");
  const [isCodeView, setIsCodeView] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [keywordCount, setKeywordCount] = useState(0);
  const [keywordDensity, setKeywordDensity] = useState(0);
  const [suggestedKeywordCount, setSuggestedKeywordCount] = useState("");
  const [totalCharacters, setTotalCharacters] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const quillRef = useRef();

  const updateWordAndCharacterCount = useCallback(() => {
    const cleanContent = content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    const totalCharacters = cleanContent.length;
    const words = cleanContent.split(" ");
    const totalWords = words.filter((word) => word.length > 0).length;

    setTotalCharacters(totalCharacters);
    setTotalWords(totalWords);
  }, [content]);

  useEffect(() => {
    updateWordAndCharacterCount();
  }, [content, updateWordAndCharacterCount]);

  // Thay đổi trạng thái editor
  const handleToggleCodeView = () => {
    setIsCodeView((prev) => !prev);
  };

  // Loại bỏ dấu tiếng Việt
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  // Hàm tính mật độ từ khóa
  const calculateDensity = () => {
    if (!keyword || !content) {
      alert("Vui lòng nhập cả từ khóa và nội dung.");
      return;
    }

    const keywordNoAccent = removeVietnameseTones(keyword.toLowerCase());
    const contentNoAccent = removeVietnameseTones(
      content.replace(/<[^>]*>/g, "").toLowerCase()
    );

    const regex = new RegExp(keywordNoAccent, "gi");
    const matches = contentNoAccent.match(regex);
    const keywordCount = matches ? matches.length : 0;
    setKeywordCount(keywordCount);

    const totalWords = contentNoAccent
      .split(" ")
      .filter((word) => word.length > 0).length;
    const keywordDensity = (keywordCount / totalWords) * 100;
    setKeywordDensity(keywordDensity.toFixed(2));

    suggestKeywordAppearance(totalWords);
    highlightKeyword();
  };

  // Hàm highlight từ khóa
  const highlightKeyword = () => {
    if (!keyword) {
      console.error("Từ khóa không được nhập");
      return;
    }

    const keywordRegex = new RegExp(keyword, "gi");
    const highlightedContent = content.replace(keywordRegex, (match) => {
      return `<span style="background-color:#f1c40f"><strong>${match}</strong></span>`;
    });

    setContent(highlightedContent);
  };

  // Hàm đề xuất số lần xuất hiện từ khóa
  const suggestKeywordAppearance = (totalWords) => {
    const keywordLength = keyword.split(/\s+/).length;
    let suggestedCount = 0;

    if (keywordLength >= 1 && keywordLength <= 4) {
      suggestedCount = ((2.5 / 100) * totalWords) / 4;
    } else if (keywordLength >= 5 && keywordLength <= 9) {
      suggestedCount = ((2.5 / 100) * totalWords) / keywordLength;
    }

    let result;
    if (suggestedCount % 1 < 0.5) {
      result = Math.floor(suggestedCount);
    } else {
      result = `${Math.floor(suggestedCount)} hoặc ${Math.ceil(
        suggestedCount
      )}`;
    }
    setSuggestedKeywordCount(result);
  };

  return (
    <div className="container">
      <h1 style={{ marginBottom: '16px' }}>ĐỀ XUẤT VÀ TÍNH MẬT ĐỘ TỪ KHÓA</h1>
      <Input
        placeholder="Nhập từ khóa"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      {!isCodeView ? (
        <ReactQuill
          ref={(el) => (quillRef.current = el)}
          value={content}
          onChange={setContent}
          theme="snow"
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }], // Header với các cấp độ khác nhau
              [{ font: [] }], // Font để lựa chọn phông chữ
              ["bold", "italic", "underline", "strike"], // Các nút định dạng văn bản
              [{ list: "ordered" }, { list: "bullet" }], // Danh sách sắp xếp
              [{ align: [] }], // Căn lề: trái, giữa, phải, justify
              ["link", "image", "video"], // Liên kết, hình ảnh, video
              ["code-block"], // Chèn đoạn mã code
              [{ color: [] }, { background: [] }], // Màu văn bản và nền văn bản
              ["clean"], // Nút xóa định dạng
            ],
          }}
          style={{ height: 500 }}
        />
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: "100%", height: 500, padding: "10px" }}
        />
      )}
      <div style={{ marginTop: '16px' }}>
        <Button
          type="primary"
          onClick={handleToggleCodeView}
          icon={isCodeView ? <EditOutlined /> : <CodeOutlined />}
          style={{ marginRight: '8px' }}
        >
          {isCodeView ? "Visual Editor" : "Show Code"}
        </Button>
        <Button type="primary" onClick={calculateDensity} style={{ marginRight: '8px' }}>
          Tính Mật Độ Từ Khóa
        </Button>
      </div>
      <div style={{ marginTop: '16px' }}>
        <p><strong>Tổng số ký tự:</strong> {totalCharacters}</p>
        <p><strong>Tổng số từ:</strong> {totalWords}</p>
        <p>Số lần xuất hiện từ khóa: {keywordCount}</p>
        <p>Mật độ từ khóa: {keywordDensity}%</p>
        <p>Đề xuất số lần xuất hiện từ khóa: {suggestedKeywordCount}</p>
      </div>
    </div>
  );
}

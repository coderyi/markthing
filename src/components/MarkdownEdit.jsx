import React, { useEffect, useState, useRef } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert, AlertTitle } from "@material-ui/lab";
import placeholder from "../data/placeholder";
import { CgSoftwareDownload as SaveIcon, CgFormatHeading, CgFormatItalic, CgCodeSlash, CgLink } from "react-icons/cg";
import { MdContentCopy as CopyIcon, MdFormatBold, MdStrikethroughS, MdFormatQuote, MdFormatListBulleted } from "react-icons/md";
import { MdDelete as CleanIcon } from "react-icons/md";
import { FiTerminal } from "react-icons/fi";
import { FaTable, FaImages } from "react-icons/fa";
import { AiOutlineImport } from "react-icons/ai";


import { Tooltip } from "@material-ui/core";

function MarkdownEdit({ content, changeContent }) {
  const [open, setOpen] = useState(false);
  const editorRef = useRef(null);
  useEffect(() => {
    if (content === "") {
      localStorage.setItem("markdown", placeholder);
    } else {
      localStorage.setItem("markdown", content);
    }
    var mdEditor = document.getElementById('editor');
    var { currentLineNumber, currentColumnIndex } = getLineNumberAndColumnIndex(mdEditor);
    var lineColumn = document.getElementById('line-column');
    lineColumn.textContent = 'Line ' + currentLineNumber + ' Col ' + currentColumnIndex + ' Word ' + content.length;

  }, [content]);

  function getLineNumberAndColumnIndex (textarea) {
    let texts = textarea.value.slice(0, textarea.selectionStart).split(/\n|\r\n/);
    let currentLineNumber = texts.length;
    let currentColumnIndex = texts[texts.length - 1].length;
    return { currentLineNumber, currentColumnIndex };
  }

  const handleEditorChange = (event) => {
    event.preventDefault();
    changeContent(event.target.value);
  };

  const handleClearClick = () => {
    changeContent("");
    editorRef.current.focus();
  };
  const handleImportClick = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput.click();
  };
  const handleFileInput = (e) => {
    if (window.FileReader) {
      const file = e.target.files[0];
      const fileSize = file.size / 1024 / 1024;
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        if (fileSize < 3) {
          changeContent(e.target.result)
        }
      };
      fileReader.readAsText(file);
    } 
  };
  
  const handleDownloadClick = () => {
    let blob = new Blob([content], {
      type: "text/plain",
    });
    let a = document.createElement("a");
    a.download = "markdown.md";
    a.href = window.URL.createObjectURL(blob);
    a.click();
  };
  const handleHeadingClick = () => {
    var contentValue = content + "# "
    changeContent(contentValue);

  };
  const handleBoldClick = () => {
    var contentValue = content + "** **"
    changeContent(contentValue);

  };
  const handleItalicClick = () => {
    var contentValue = content + "* *"
    changeContent(contentValue);

  };
  const handleStrikethroughClick = () => {
    var contentValue = content + "~~ ~~"
    changeContent(contentValue);

  };
  const handleTerminalClick = () => {
    var contentValue = content + "` `"
    changeContent(contentValue);

  };
  const handleCodeClick = () => {
    var contentValue = content + "```language\nyour code\n```"
    changeContent(contentValue);
  };
  const handleLinkClick = () => {
    var contentValue = content + "[]()"
    changeContent(contentValue);
  };
  const handleTableClick = () => {
    var contentValue = content + "A | B | C\n---|---|---\nD | E | F\n"
    changeContent(contentValue);
  };
  const handleQuoteClick = () => {
    var contentValue = content + "> \n"
    changeContent(contentValue);
  };
  const handleListClick = () => {
    var contentValue = content + "- \n"
    changeContent(contentValue);
  };
  const handleImageClick = () => {
    var contentValue = content + "![]()\n"
    changeContent(contentValue);
  };

  const handleCopyClick = () => {
    copyToClipBoard("editor");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="markdown-edit scroll">
      <div className="section-title">
        <h3>Markdown</h3>
        <div className="right-section">
          <button onClick={handleHeadingClick} className="editorbtn">
            <CgFormatHeading />
          </button>
          <button onClick={handleBoldClick} className="editorbtn">
            <MdFormatBold />
          </button>
          <button onClick={handleItalicClick} className="editorbtn">
            <CgFormatItalic />
          </button>
          <button onClick={handleStrikethroughClick} className="editorbtn">
            <MdStrikethroughS />
          </button>
          <button onClick={handleTerminalClick} className="editorbtn">
            <FiTerminal />
          </button>
          <button onClick={handleCodeClick} className="editorbtn">
            <CgCodeSlash />
          </button>
          <button onClick={handleLinkClick} className="editorbtn">
            <CgLink />
          </button>
          <button onClick={handleTableClick} className="editorbtn">
            <FaTable />
          </button>
          <button onClick={handleQuoteClick} className="editorbtn">
            <MdFormatQuote />
          </button>
          <button onClick={handleListClick} className="editorbtn">
            <MdFormatListBulleted />
          </button>
          <button onClick={handleImageClick} className="editorbtn">
            <FaImages />
          </button>
        </div>
        
        <div className="right-section">
        <Tooltip title="Import Markdown">
            <button onClick={handleImportClick} className="btn">
              <input
                type="file"
                id="fileInput"
                onChange={handleFileInput}
                accept=".txt,.md,"
              />
              <AiOutlineImport />
            </button>
          </Tooltip>
          <Tooltip title="Download Markdown">
            <button onClick={handleDownloadClick} className="btn">
              <SaveIcon />
            </button>
          </Tooltip>
          <Tooltip title="Copy to Clipboard">
            <button onClick={handleCopyClick} className="btn">
              <CopyIcon />
            </button>
          </Tooltip>
          <Tooltip title="Clean">
            <button onClick={handleClearClick} className="btn">
              <CleanIcon />
            </button>
          </Tooltip>
        </div>
      </div>
      <textarea
        className="editable"
        value={content}
        onChange={handleEditorChange}
        id="editor"
        ref={editorRef}></textarea>
      <div className="text-bottom">
        <p id="line-column">Line 1 Col 0</p>
      </div>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          elevation={6}
          variant="filled">
          <AlertTitle>Copied</AlertTitle>
          The markdown is copied to your clipboard
        </Alert>
      </Snackbar>
    </div>
  );
}

const copyToClipBoard = (id) => {
  document.getElementById(id).select();
  document.execCommand("copy");
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
};

export default MarkdownEdit;

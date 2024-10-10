import React, { useState } from "react";

// Component to render the dropdown tree with expandable parents
const DropdownTree = ({ data, selectedOptions, handleOptionClick, expandedNodes, toggleNode }) => {
  return (
    <ul className="ml-4">
      {data.map((node) => (
        <li key={node.id} className="flex flex-col">
          {/* Parent node */}
          <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              className="mr-2"
              // Set checkbox based on whether the option is selected
              checked={selectedOptions.includes(node.displayname)}
              onChange={() => handleOptionClick(node.displayname)}
            />
            <label>{node.displayname}</label>
            {/* Expand/collapse icon */}
            {node.Nodes && node.Nodes.length > 0 && (
              <button
                className="ml-2 text-xs"
                onClick={() => toggleNode(node.id)}
              >
                {expandedNodes.includes(node.id) ? "▲" : "▼"}
              </button>
            )}
          </div>

          {/* Render child nodes only if the parent is expanded */}
          {expandedNodes.includes(node.id) && node.Nodes && node.Nodes.length > 0 && (
            <DropdownTree
              data={node.Nodes}
              selectedOptions={selectedOptions}
              handleOptionClick={handleOptionClick}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
            />
          )}
        </li>
      ))}
    </ul>
  );
};

function CustomDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState([]); // Tracks which parent nodes are expanded

  // JSON hierarchical data
  const data = [
    {
      id: "317",
      displayname: "academic",
      hirerchicalid: "63",
      Label: "academic",
      Nodes: [
        {
          id: "319",
          displayname: "Miscellenous",
          hirerchicalid: "631010",
          Label: "Miscellenous",
          Nodes: [
            {
              id: "320",
              displayname: "Miscellenous",
              hirerchicalid: "63101010",
              Label: "Miscellenous",
              Nodes: [],
              Parentnodeid: "319",
            },
            {
              id: "321",
              displayname: "Miscellenous-2",
              hirerchicalid: "6310101012",
              Label: "Miscellenous-2",
              Nodes: [],
              Parentnodeid: "319",
            },
          ],
          Parentnodeid: "317",
        },
        {
          id: "323",
          displayname: "professional",
          hirerchicalid: "631030",
          Label: "professional",
          Nodes: [
            {
              id: "324",
              displayname: "professional",
              hirerchicalid: "63103010",
              Label: "professional",
              Nodes: [],
              Parentnodeid: "323",
            },
          ],
          Parentnodeid: "317",
        },
        {
          id: "321",
          displayname: "school",
          hirerchicalid: "631020",
          Label: "school",
          Nodes: [
            {
              id: "322",
              displayname: "school",
              hirerchicalid: "63102010",
              Label: "school",
              Nodes: [],
              Parentnodeid: "321",
            },
          ],
          Parentnodeid: "317",
        },
      ],
      Parentnodeid: "",
    },
    {
      id: "227",
      displayname: "basic",
      hirerchicalid: "51",
      Label: "basic",
      Nodes: [
        {
          id: "14",
          displayname: "basic",
          hirerchicalid: "511010",
          Label: "basic",
          Nodes: [],
          Parentnodeid: "227",
        },
      ],
      Parentnodeid: "",
    },
  ];

  // Toggles dropdown open/close
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handles selecting or deselecting an option
  const handleOptionClick = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // Toggle expansion of parent nodes
  const toggleNode = (nodeId) => {
    if (expandedNodes.includes(nodeId)) {
      setExpandedNodes(expandedNodes.filter((id) => id !== nodeId));
    } else {
      setExpandedNodes([...expandedNodes, nodeId]);
    }
  };

  return (
    <div className="relative w-64">
      {/* Dropdown button */}
      <button
        className="w-full bg-white border border-gray-300 rounded-lg py-2 px-4 text-left flex justify-between items-center"
        onClick={toggleDropdown}
      >
        {selectedOptions.length > 0 ? selectedOptions.join(", ") : "Choose..."}
        <span className="ml-2">▼</span>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10">
          <DropdownTree
            data={data}
            selectedOptions={selectedOptions}
            handleOptionClick={handleOptionClick}
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
          />
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;

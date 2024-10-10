import React, { useState, useEffect } from "react";

// Sample Data
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
            id: "321-2", 
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
        id: "321", // Kept this ID unchanged for "school"
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


// Recursive Dropdown Item Component
const DropdownItem = ({ item, selectedItems, toggleSelect, setSelectedItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSelect = () => toggleSelect(item);

  const isSelected = selectedItems.some(
    (selectedItem) => selectedItem.id === item.id
  );

  // Check if all children are selected or partially selected
  const areAllChildrenSelected = item.Nodes.length > 0 && item.Nodes.every(child => selectedItems.some(selectedItem => selectedItem.id === child.id));
  const isIndeterminate = item.Nodes.length > 0 && item.Nodes.some(child => selectedItems.some(selectedItem => selectedItem.id === child.id)) && !areAllChildrenSelected;

  // Handle parent-child selection logic
  const handleParentSelect = () => {
    if (areAllChildrenSelected) {
      // If all children are selected, unselect all
      setSelectedItems(
        selectedItems.filter((selectedItem) => !item.Nodes.some(child => child.id === selectedItem.id))
      );
    } else {
      // Else, select parent only (not children)
      if (!isSelected) {
        setSelectedItems([...selectedItems, item]); // Add parent
      } else {
        setSelectedItems(selectedItems.filter((selectedItem) => selectedItem.id !== item.id)); // Remove parent
      }
    }
  };

  return (
    <div className="mb-2">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isSelected || areAllChildrenSelected}
          onChange={item.Nodes.length > 0 ? handleParentSelect : handleSelect}
          className="mr-2"
          ref={(input) => input && (input.indeterminate = isIndeterminate)}
        />
        <span onClick={toggleOpen} className="cursor-pointer">
          {item.displayname}
        </span>
        {item.Nodes.length > 0 && (
          <button onClick={toggleOpen} className="ml-auto">
            {isOpen ? "▲" : "▼"}
          </button>
        )}
      </div>
      {isOpen && item.Nodes.length > 0 && (
        <div className="ml-4 mt-2">
          {item.Nodes.map((child) => (
            <DropdownItem
              key={child.id}
              item={child}
              selectedItems={selectedItems}
              toggleSelect={toggleSelect}
              setSelectedItems={setSelectedItems}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Main Dropdown Component
const NestedDropdown = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleSelect = (item) => {
    const isAlreadySelected = selectedItems.some(
      (selectedItem) => selectedItem.id === item.id
    );

    if (isAlreadySelected) {
      // If already selected, deselect (remove)
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      );
    } else {
      // Else, select (add)
      setSelectedItems([...selectedItems, item]);
    }
  };

  const removeItem = (itemId) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
  };

  const handleDropdownClick = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="w-64">
      {/* Selected Items Dropdown Box */}
      <div
        className="border rounded-lg p-2 flex flex-wrap items-center cursor-pointer"
        onClick={handleDropdownClick}
      >
        {selectedItems.length === 0 ? (
          <span className="text-gray-400">Choose...</span>
        ) : (
          selectedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-pink-100 text-pink-600 px-2 py-1 rounded-lg mr-2 mb-2"
            >
              {item.displayname}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="ml-2 text-pink-600"
              >
                ✕
              </button>
            </div>
          ))
        )}
        {/* Toggle Arrow based on dropdown state */}
        <span className="ml-auto">
          {isDropdownOpen ? "▲" : "▼"}
        </span>
      </div>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div className="border rounded-lg p-2 mt-2 max-h-64 overflow-y-auto">
          {data.map((item) => (
            <DropdownItem
              key={item.id}
              item={item}
              selectedItems={selectedItems}
              toggleSelect={toggleSelect}
              setSelectedItems={setSelectedItems}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NestedDropdown;

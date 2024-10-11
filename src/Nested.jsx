import React, { useState } from "react";

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
        displayname: "Miscellaneous",
        hirerchicalid: "631010",
        Label: "Miscellaneous",
        Nodes: [
          {
            id: "320",
            displayname: "Miscellaneous-1",
            hirerchicalid: "63101010",
            Label: "Miscellaneous-1",
            Nodes: [],
            Parentnodeid: "319",
          },
          {
            id: "321-2",
            displayname: "Miscellaneous-2",
            hirerchicalid: "6310101012",
            Label: "Miscellaneous-2",
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
            displayname: "professional-1",
            hirerchicalid: "63103010",
            Label: "professional",
            Nodes: [],
            Parentnodeid: "323",
          },
        ],
        Parentnodeid: "317",
      },
      {
        id: "321", // ID unchanged for "school"
        displayname: "school",
        hirerchicalid: "631020",
        Label: "school",
        Nodes: [
          {
            id: "322",
            displayname: "school-1",
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
        displayname: "basic-1",
        hirerchicalid: "511010",
        Label: "basic",
        Nodes: [],
        Parentnodeid: "227",
      },
    ],
    Parentnodeid: "",
  },
];

// Main Dropdown Component
const NestedDropdown = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [openNodes, setOpenNodes] = useState({});

  const toggleSelect = (item) => {
    const isAlreadySelected = selectedItems.some(
      (selectedItem) => selectedItem.id === item.id
    );

    if (isAlreadySelected) {
      setSelectedItems((prev) =>
        prev.filter((selectedItem) => selectedItem.id !== item.id)
      );
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  const removeItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleDropdownClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleNode = (id) => {
    setOpenNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleParentSelect = (item) => {
    const areAllChildrenSelected = item.Nodes.every((child) =>
      selectedItems.some((selectedItem) => selectedItem.id === child.id)
    );

    if (areAllChildrenSelected) {
      // Unselect all children if all are selected
      setSelectedItems((prev) =>
        prev.filter((selectedItem) => !item.Nodes.some((child) => child.id === selectedItem.id))
      );
    } else {
      // Select the parent and all its children
      setSelectedItems((prev) => {
        const newSelectedItems = new Set(prev);
        newSelectedItems.add(item); // Add parent

        // Add children
        item.Nodes.forEach((child) => newSelectedItems.add(child));

        return Array.from(newSelectedItems);
      });
    }
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
        <span className="ml-auto">{isDropdownOpen ? "▲ " : "▼ "}</span>
      </div>

      {/* Dropdown List */}
      {isDropdownOpen && (
        <div className="border rounded-lg p-2 mt-2 max-h-64 overflow-y-auto">
          {data.map((item) => {
            // Check if the parent is selected
            const areAnyChildrenSelected = item.Nodes.some((child) =>
              selectedItems.some((selectedItem) => selectedItem.id === child.id)
            );

            const areAllChildrenSelected = item.Nodes.every((child) =>
              selectedItems.some((selectedItem) => selectedItem.id === child.id)
            );

            const isIndeterminate = item.Nodes.length > 0 && areAnyChildrenSelected && !areAllChildrenSelected;

            return (
              <div key={item.id} className="mb-2">
                <div className="flex items-center">
                {item.Nodes.length > 0 && (
                    <button onClick={() => toggleNode(item.id)} className="">
                      {openNodes[item.id] ? ">" : "^"}
                    </button>
                  )}
                  <input
                    type="checkbox"
                    checked={areAllChildrenSelected}
                    onChange={() => handleParentSelect(item)}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = isIndeterminate;
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="cursor-pointer" onClick={() => toggleNode(item.id)}>
                    {item.displayname}
                  </span>
                 
                </div>
                {openNodes[item.id] && item.Nodes.length > 0 && (
                  <div className="ml-4 mt-2">
                    {item.Nodes.map((child) => (
                      <div key={child.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.some((selectedItem) => selectedItem.id === child.id)}
                          onChange={() => toggleSelect(child)}
                          className="mr-2"
                        />
                        <span>{child.displayname}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NestedDropdown;

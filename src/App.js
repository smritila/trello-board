import React, { useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import { v4 } from "uuid";

const item = {
  id: v4(),
  name: "Clean the house",
};

const item2 = {
  id: v4(),
  name: "Wash the car",
};

function App() {
  const initialState = {
    ongoing: {
      title: "Ongoing",
      items: [item, item2],
    },
    delayed: {
      title: "Delayed",
      items: [],
    },
    finished: {
      title: "Finished",
      items: [],
    },
  };
  const [text, setText] = useState("");
  const [state, setState] = useState(initialState);

  //setText("abc");
  /**
   * 
   setText((prevState) => {
    return prevState + "!!!";
   })
   */

  const handleDragEnd = ({ destination, source }) => {
    console.log("from", source);
    console.log("to", destination);
    if (!destination) {
      return;
    }
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }
    // Creating a copy of item before removing it from state

    const itemCopy = {
      ...state[source.droppableId].items[source.index],
    };
    setState((prev) => {
      prev = { ...prev };
      // Remove from previous items array

      prev[source.droppableId].items.splice(source.index, 1);

      // Adding to new item array location
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );
      return prev;
    });
  };
  const addItem = () => {
    if (text != "") {
      setState((prev) => {
        return {
          ...prev,
          ongoing: {
            title: "Ongoing",
            items: [
              {
                id: v4(),
                name: text,
              },
              ...prev.ongoing.items,
            ],
          },
        };
      });
      setText("");
    }
  };

  return (
    <div className="App">
      <div>
        <input
          type="text"
          className={"input-field"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add some task here"
        />
        <button onClick={addItem}>
          <FontAwesomeIcon
            icon={faPlus}
            className="fa-color mr-2"
          ></FontAwesomeIcon>
          Add
        </button>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {_.map(state, (data, key) => {
          return (
            <div key={key} className="column">
              <h3>{data.title}</h3>
              <Droppable droppableId={key}>
                {(provided, snapshot) => {
                  console.log(snapshot);
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="droppable-col"
                    >
                      {data.items.map((el, index) => {
                        return (
                          <Draggable
                            key={el.id}
                            index={index}
                            draggableId={el.id}
                          >
                            {(provided, snapshot) => {
                              console.log(snapshot);
                              return (
                                <div
                                  className={`item ${
                                    snapshot.isDragging && "dragging"
                                  }`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {el.name}
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;

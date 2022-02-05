import React, { useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

export default function App() {
  const [width, setWith] = useState('100%');
  const [height, setHeight] = useState('400px');
  // Adding elements here
  const [graphData, setGraphData] = useState([
    // Node format
    { data: { id: '1', label: 'Node 1' } },
    { data: { id: '2', label: 'Node 2' } },
    { data: { id: '3', label: 'Node 3' } },
    { data: { id: '4', label: 'Node 4' } },
    { data: { id: '5', label: 'Node 5' } },
    { data: { id: '6', label: 'Node 6' } },
    { data: { id: '7', label: 'Node 7' } },
    { data: { id: '8', label: 'Node 8' } },
    // Edge format
    { data: { source: '1', target: '2', label: 'Edge from 1 to 2' } },
    { data: { source: '1', target: '3', label: 'Edge from 1 to 3' } },
    { data: { source: '4', target: '5', label: 'Edge from 4 to 5' } },
    { data: { source: '6', target: '8', label: 'Edge from 6 to 8' } },
  ]);

  return (
    <div>
      <h1>Representação Grafo</h1>
      <div
        style={{
          border: '1px solid',
          backgroundColor: '#f5f6fe',
        }}
      >
        <CytoscapeComponent
          elements={graphData}
          style={{ width, height }}
          // adding a layout
          layout={{
            name: 'breadthfirst',
            fit: true,
            directed: true,
            padding: 50,
            animate: true,
            animationDuration: 1000,
            avoidOverlap: true,
            nodeDimensionsIncludeLabels: false,
          }}
          // adding style sheet
          stylesheet={[
            {
              selector: 'node',
              style: {
                backgroundColor: '#555',
                width: 60,
                height: 60,
                label: 'data(label)',
                'text-valign': 'center',
                'text-halign': 'center',
                'text-outline-color': '#555',
                'text-outline-width': '2px',
                'overlay-padding': '6px',
                'z-index': '10',
              },
            },
            {
              selector: 'node:selected',
              style: {
                'border-width': '6px',
                'border-color': '#AAD8FF',
                'border-opacity': '0.5',
                'background-color': '#77828C',
                'text-outline-color': '#77828C',
              },
            },
            {
              selector: 'label',
              style: {
                color: 'white',
                width: 30,
                height: 30,
                fontSize: 30,
                // shape: "rectangle"
              },
            },
            {
              selector: 'edge',
              style: {
                width: 3,
                // "line-color": "#6774cb",
                'line-color': '#AAD8FF',
                'target-arrow-color': '#6774cb',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
              },
            },
          ]}
        />
      </div>
    </div>
  );
}

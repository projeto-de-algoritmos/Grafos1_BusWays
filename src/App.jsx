import React, { useEffect, useState } from 'react';

import CytoscapeComponent from 'react-cytoscapejs';
import Select from 'react-select';
// import Crawler from './data/crawler';

import data from './data/data.json';
import getAllPaths from './utils/graph';

import './styles/index.css';

export default function App() {
  const [citiesOptions, setCitiesOptions] = useState(
    Object.keys(data).map((key, index) => ({ value: index, label: key })),
  );
  const [width, setWidth] = useState('100%');
  const [height, setHeight] = useState(`400px`);

  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedDestiny, setSelectedDestiny] = useState('');
  const [path, setPath] = useState([]);

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

  useEffect(() => {
    console.log({
      origem: selectedOrigin,
      destino: selectedDestiny,
    });
  }, [selectedOrigin, selectedDestiny]);

  const handleOnClick = e => {
    console.log('clicou');
    e.preventDefault();

    setPath(getAllPaths(selectedOrigin, selectedDestiny));
  };

  return (
    <div id="container">
      <section id="container-center">
        <header>
          <h1>BusWays</h1>
          <div className="inputs-box">
            <div id="input-container">
              <strong>Origem</strong>
              {/* <input className="input-city" type="text" /> */}
              <Select
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    fontSize: '1.6rem',
                  }),
                }}
                // value={selectedOrigin}
                className="input-city"
                classNamePrefix="input-city"
                placeholder="Digite a cidade de origem..."
                options={citiesOptions}
                onChange={option => setSelectedOrigin(option.label)}
              />
            </div>
            <div id="input-container">
              <strong>Destino</strong>
              {/* <input className="input-city" type="text" /> */}
              <Select
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    fontSize: '1.6rem',
                  }),
                }}
                // value={selectedDestiny}
                className="input-city"
                classNamePrefix="input-city"
                placeholder="Digite a cidade de destino..."
                options={citiesOptions}
                onChange={option => setSelectedDestiny(option.label)}
              />
            </div>
          </div>
          <button id="search-button" type="button" onClick={handleOnClick}>
            Buscar
          </button>
        </header>
        <div id="container-graph">
          {path.map((city, index) => (
            <section id="city">
              {path[index + 1] !== undefined && (
                <h4>{`${city} para ${path[index + 1]}`}</h4>
              )}
              {/* <p>{'->'}</p> */}
            </section>
          ))}
          {/* <CytoscapeComponent
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
                  'text-valign': 'bottom',
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
                  'border-width': '8px',
                  'border-color': '#03437a',
                  'border-opacity': '0.5',
                  'background-color': '#a6b6c5',
                  'text-outline-color': '#a6b6c5',
                },
              },
              {
                selector: 'label',
                style: {
                  color: 'white',
                  width: 30,
                  height: 30,
                  fontSize: 30,
                  shape: 'ellipse',
                },
              },
              {
                selector: 'edge',
                style: {
                  width: 10,
                  'line-color': '#03437a',
                  'target-arrow-color': '#970384',
                  'target-arrow-shape': 'triangle',
                  'curve-style': 'bezier',
                },
              },
            ]}
          /> */}
        </div>
      </section>
    </div>
  );
}

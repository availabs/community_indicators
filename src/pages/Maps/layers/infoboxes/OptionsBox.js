import React from "react"

import LightTheme from "components/common/themes/light_new"

import styled from "styled-components"
import * as d3scale from "d3-scale"
import { format as d3format } from "d3-format"

const A = styled.a`
  &.nav-link {
    padding: 0.25rem 1rem!important;
  }
`

const CloseButton = styled.div`
  flex-grow: 0;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color: 0.15s;
  :hover {
    background-color: #ccc;
  }
`

const drawLegend = (newCanvas, mbCanvas, layer) => {
  const context = newCanvas.getContext("2d")
  context.drawImage(mbCanvas, 0, 0);

  let x = mbCanvas.width - 20 - 360,
    y = 20;

  context.fillStyle = LightTheme.sidePanelBg;
  context.fillRect(x, y, 360, 70);

  x += 10;
  y += 10;

  context.fillStyle = LightTheme.sidePanelHeaderBg;
  context.fillRect(x, y, 340, 50);

  x += 10;
  y += 10;
  const w = 320 / layer.legend.range.length;
  layer.legend.range.forEach((c, i) => {
    context.fillStyle = c;
    context.fillRect(x + i * w, y, w, 20);
  })

  let scale;

  switch (layer.legend.type) {
    case "quantile":
      scale = d3scale.scaleQuantile()
        .domain(layer.legend.domain)
        .range(layer.legend.range);
      break;
    case "quantize":
      scale = d3scale.scaleQuantize()
        .domain(layer.legend.domain)
        .range(layer.legend.range);
      break;
  }

  const format = (typeof layer.legend.format === "function") ?
    layer.legend.format :
    d3format(layer.legend.format);

  x += 3;
  y += 33;
  context.fillStyle = LightTheme.textColor;
  context.font = "12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif";
  context.textAlign = "right";
  layer.legend.range.forEach((c, i) => {
    const text = format(scale.invertExtent(c)[1]);
    context.fillText(text, x + w + i * w, y);
  })

}

export default ({ layer }) => {
  const [fileName, setFileName] = React.useState(layer.filters.census.value);

  const [isOpen, setIsOpen] = React.useState(false);

  const modalAction = React.useCallback(type => {
    setIsOpen(false);
    const isOpen = layer.modals.options.show;
    if (isOpen) {
      layer.doAction(["updateModal", "options", { type, geoData: layer.geoData }]);
    }
    else {
      layer.doAction(["toggleModal", "options", { type, geoData: layer.geoData }]);
    }
  }, [layer]);

  const getImageUrl = React.useCallback(() => {
    const canvas = document.querySelector("#haz-mit-avl-map canvas.mapboxgl-canvas"),
      newCanvas = document.createElement("canvas");

    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;

    const context = newCanvas.getContext("2d")
    context.drawImage(canvas, 0, 0);

    drawLegend(newCanvas, canvas, layer);

    return newCanvas.toDataURL();
  }, [layer]);

  const saveImage = React.useCallback(e => {
    e.preventDefault();
    e.stopPropagation();

    const anchor = document.createElement("a");

    anchor.setAttribute("href", getImageUrl());
    anchor.setAttribute("download", fileName);
    anchor.click();

    setIsOpen(false);
  }, [])

  React.useEffect(() => {
    setFileName(layer.filters.census.value);
  }, [layer.filters.census.value]);

  return (
    <div>
       <div className="os-tabs-controls"
        style={ { cursor: "pointer", marginBottom: "0px" } }>
         <ul className="nav nav-tabs smaller">
            <li className="nav-item" style={ { margin: 0, flexGrow: 1, textAlign: "center" } }>
              <A className="nav-link" onClick={ e => modalAction("view-data") }>View Data</A>
            </li>
            <li className="nav-item" style={ { margin: 0, flexGrow: 1, textAlign: "center" } }>
              <A className="nav-link"  onClick={ e => setIsOpen(true) }>Save Image</A>
            </li>
            { /*
              <li className="nav-item" style={ { margin: 0 } }>
                <A className="nav-link"  onClick={ e => {} }>Share Embed</A>
              </li>
              */
            }
         </ul>
      </div>
      <div style={ { display: isOpen ? "block" : "none" } }>
        <div style={ {
            margin: "10px 0px", textAlign: "center", position: "relative",
            display: "flex", alignItems: "center",
            fontWeight: "bold", fontSize: "1.25rem"
          } }>
          <div style={ {
            flexGrow: 1
          } }>Save Image as .png</div>
          <CloseButton onClick={ e => setIsOpen(false) }>
            <span className="fa fa-close"/>
          </CloseButton>
        </div>
        <div className="input-group">
          <input className="form-control"
            onChange={ e => setFileName(e.target.value) }
            value={ fileName }/>
          <div className="input-group-append">
            <span className="input-group-text">.png</span>
          </div>
        </div>
        <div style={ { marginTop: "10px" } }>
          <button className="btn btn-outline-primary btn-block"
            onClick={ saveImage }>
            Save Image
          </button>
        </div>
      </div>
    </div>
  )
}

import React from "react"
import { connect } from "react-redux"

import styled from "styled-components"

import AvlModal from "components/AvlStuff/AvlModal"
import AvlTable from "components/AvlStuff/AvlTable"

import {
  setOptionsModalPage,
  closeOptionsModal
} from "store/modules/options"

class OptionsModal extends React.Component {
  getPage() {
    switch (this.props.page) {
      case "view-data":
        return (
          <div style={ { minWidth: "800px", width: "90vw"}}>
            <AvlTable { ...this.props.data } key={ this.props.tableTitle }
              showHelp={ true }
              title={ this.props.tableTitle }/>
          </div>
        )
      default:
        return <NotYetImplemented page={ this.props.page }/>
    }
  }
  render() {
    return (
      <AvlModal show={ this.props.showModal }
        onHide={ this.props.closeOptionsModal }>
        <div style={ { minWidth: "800px" } }>
          <ModalHeader page={ this.props.page }
            setPage={ this.props.setOptionsModalPage }/>
        </div>
        { this.getPage() }
      </AvlModal>
    )
  }
}
const mapStateToProps = state => ({
  showModal: state.options.showModal,
  page: state.options.page,
  data: state.options.data,
  tableTitle: state.options.tableTitle
})
const mapDispatchToProps = {
  setOptionsModalPage,
  closeOptionsModal
}
export default connect(mapStateToProps, mapDispatchToProps)(OptionsModal)

const NotYetImplemented = ({ page }) =>
  <div>
    { page } NOT YET IMPLEMENTED
  </div>

const StyledModalHeader = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;

  > * {
    padding: 2px 0px;
    padding-right: 20px
    text-align: center;
    width: 33.333%;
    cursor: pointer;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
  }
  > *:hover {
    background-color: ${ props => props.theme.panelBackgroundHover };
  }
  > *.active {
    border-bottom: 2px solid currentColor;
  }
  > *:last-child {
    padding-right: 0px;
  }
`
const ModalHeader = ({ page, setPage }) =>
  <StyledModalHeader>
    <div className={ page === "view-data" ? "active" : "" }
      onClick={ e => setPage("view-data") }>
      View Data
    </div>
    <div className={ page === "save-image" ? "active" : "" }
      onClick={ e => setPage("save-image") }>
      Save Image
    </div>
    <div className={ page === "share-embed" ? "active" : "" }
      onClick={ e => setPage("share-embed") }>
      Share Embed
    </div>
  </StyledModalHeader>

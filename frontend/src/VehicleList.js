import React, { Component } from "react";
import {
  Stack,
  ButtonGroup,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DescriptionIcon from "@mui/icons-material/Description";
import AppNavbar from "./AppNavbar";
import { Link } from "react-router-dom";

class VehicleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicles: [],
      deleteDialogOpen: false,
      currentVehicle: null,
      notesOpen: false,
    };
    this.remove = this.remove.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.displayNotes = this.displayNotes.bind(this);
    this.closeNotes = this.closeNotes.bind(this);
  }

  componentDidMount() {
    fetch("/api/vehicles")
      .then((response) => response.json())
      .then((data) => this.setState({ vehicles: data }));
  }

  async remove(id) {
    await fetch(`/api/vehicles/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then(() => {
      let updatedVehicles = [...this.state.vehicles].filter(
        (i) => i.vehicleId !== id
      );
      this.setState({ vehicles: updatedVehicles });
    });
  }

  displayNotes(vehicle) {
    this.setState({
      notesOpen: true,
      currentVehicle: vehicle,
    });
  }

  closeNotes() {
    this.setState({
      notesOpen: false,
      currentVehicle: null,
    });
  }

  handleDialogClose(choice) {
    if (choice === "DELETE") {
      this.remove(this.state.currentVehicle.vehicleId);
    }
    this.setState({
      deleteDialogOpen: false,
    });
  }

  handleDelete(vehicle) {
    this.setState({
      currentVehicle: vehicle,
      deleteDialogOpen: true,
    });
  }

  render() {
    const { vehicles, isLoading } = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    const vehicleList = vehicles.map((vehicle) => {
      return (
        <TableRow key={vehicle.vehicleId}>
          <TableCell style={{ whiteSpace: "nowrap" }}>
            {vehicle.vehicleId}
          </TableCell>
          <TableCell>{vehicle.description}</TableCell>
          <TableCell>{vehicle.year}</TableCell>
          <TableCell>{vehicle.make}</TableCell>
          <TableCell>{vehicle.model}</TableCell>
          <TableCell>
            <IconButton onClick={() => this.displayNotes(vehicle)}>
              <DescriptionIcon />
            </IconButton>
          </TableCell>
          <TableCell>
            <ButtonGroup>
              <IconButton
                color="success"
                component={Link}
                to={"/vehicles/" + vehicle.vehicleId}
              >
                <ModeEditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => this.handleDelete(vehicle)}
              >
                <DeleteForeverIcon />
              </IconButton>
            </ButtonGroup>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <div>
        <AppNavbar />
        <Container fluid="true">
          <Stack direction="row">
            <h3>Vehicles</h3>
            <IconButton color="success" component={Link} to="/vehicles/new">
              <PersonAddAlt1Icon />
            </IconButton>
          </Stack>
          <TableContainer>
            <Table className="mt-4">
              <TableHead>
                <TableRow>
                  <TableCell width="15%">
                    <b>Vehicle ID</b>
                  </TableCell>
                  <TableCell width="30%">
                    <b>Description</b>
                  </TableCell>
                  <TableCell width="15%">
                    <b>Year</b>
                  </TableCell>
                  <TableCell width="15%">
                    <b>Make</b>
                  </TableCell>
                  <TableCell width="15%">
                    <b>Model</b>
                  </TableCell>
                  <TableCell width="10%">
                    <b>Notes</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{vehicleList}</TableBody>
            </Table>
          </TableContainer>
        </Container>
        <Dialog
          open={this.state.deleteDialogOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure you want to delete this vehicle?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.deleteDialogOpen ? (
                <div>
                  <p>
                    Vehicle: {this.state.currentVehicle.description} <br />
                    Year: {this.state.currentVehicle.year} <br />
                    Make: {this.state.currentVehicle.make} <br />
                    Model: {this.state.currentVehicle.model} <br />
                  </p>
                  <p style={{ color: "red" }}>
                    <b>
                      Warning! All tasks and schedules for this vehicle will be
                      deleted.
                    </b>
                  </p>
                </div>
              ) : (
                ""
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleDialogClose("CANCEL")}>
              Cancel
            </Button>
            <Button onClick={() => this.handleDialogClose("DELETE")} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          onClose={this.closeNotes}
          open={this.state.notesOpen}
          aria-labelledby="notes-dialog-title"
          maxWidth="sm"
          fullWidth={true}
        >
          <DialogTitle id="notes-dialog-title">
            {this.state.currentVehicle
              ? "Notes for " + this.state.currentVehicle.description
              : ""}
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom>
              {this.state.currentVehicle ? this.state.currentVehicle.notes : ""}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.closeNotes}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
export default VehicleList;

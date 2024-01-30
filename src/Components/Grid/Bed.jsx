import React, { useState, useEffect } from 'react';
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ChromePicker } from 'react-color';
import ElderlyIcon from '@mui/icons-material/Elderly';
import BedIcon from '@mui/icons-material/Bed';
import { toast } from 'react-hot-toast';
import { Container } from '@mui/material';import BedroomParentIcon from '@mui/icons-material/BedroomParent';
import Button from '@mui/material/Button';

import availableImage from '../WiteList/new.jpg';
import occupiedImage from '../WiteList/OOP.jpg';

const BedCard = ({ bed, availableColor, occupiedColor, selectedWard }) => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCardClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  if (!bed || !bed.status || !bed.bedNumber) {
    return null;
  }

  const handleAdmitClick = () => {
    if (bed.status === "available") {
      const url = `/AdmitPatient`;
      navigate(url);
    } else {
      toast.error("Cannot admit patient to an occupied bed.");
    }
  };

  const handleTransferClick = () => {
    if (bed.status === "occupied" && selectedWard) {
      const url = `/TransferPatient?bedNumber=${bed.bedNumber.replace(
        "bed_",
        "bed_"
      )}&patientId=${bed.patientId}&patientName=${bed.patientName}&age=${
        bed.age
      }&gender=${bed.gender}&medicalAcuity=${bed.medicalAcuity}&contactno=${
        bed.contactno
      }&currentWardId=${selectedWard.wards[0].wardId}`;
      navigate(url);
    }
  };

  const handleDischargeClick = () => {
    if (bed.status === "occupied" && selectedWard) {
      const url = `/DischargePatient?bedNumber=${bed.bedNumber}&patientId=${
        bed.patientId
      }&patientName=${bed.patientName}&age=${bed.age}&gender=${
        bed.gender
      }&medicalAcuity=${bed.medicalAcuity}&contactno=${bed.contactno}&admissionDate=${
        bed.admissionDate
      }&WardId=${selectedWard.wards[0].wardId}`;
      navigate(url);
    }
  };

  return (
    <>
      <Card 
  style={{ 
    width: 100,
    height:140, 
    margin: 10,
    transition: 'transform 1.3s',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  }} 
  onClick={handleCardClick}
>
  <img 
    src={bed.status === "available" ? availableImage : occupiedImage} 
    alt={`Bed ${bed.bedNumber}`} 
    style={{ width: '100px', height: 'auto' ,}} 
  />
  <CardContent
    style={{
      backgroundColor: bed.status === "available" ? availableColor : occupiedColor,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 20,
    }}
  >
    <Typography variant="subtitle2" style={{ color: bed.status === "available" ? "white" : "black", marginTop: 10 }}>
      {bed.status === "available" ? "Available" : "Occupied"}
    </Typography>
    <Typography variant="subtitle2" style={{ color: bed.status === "available" ? "white" : "black", marginTop: 10 }}>
      {bed.bedNumber}
    </Typography>
    {bed.status === "available" && (
      <IconButton
        variant="contained"
        color="primary"
        size="small"
        style={{ marginTop: -80 }}
        onClick={handleAdmitClick}
      >
        <AddCircleOutlineIcon />
      </IconButton>
    )}
    {bed.status === "occupied" && (
      <div>
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          style={{ marginTop: -170 }}
          onClick={handleTransferClick}
        >
          <TransferWithinAStationIcon/>
        </IconButton>
        <IconButton
          variant="contained"
          color="primary"
          size="small"
          style={{ marginTop: -215,marginLeft:22 }}
          onClick={handleDischargeClick}
        >
          < ElderlyIcon/>
        </IconButton>
      </div>
    )}
  </CardContent>
</Card>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{`Bed ${bed.bedNumber}`}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2">
            Status: {bed.status === "available" ? "Available" : "Occupied"}
          </Typography>
          {/* Add more details as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </>
  );
};

const Bedsm = () => {
  const [hospitals, setHospitals] = useState([]);
  const [selectedWard, setSelectedWard] = useState(null);
  const [availableColor, setAvailableColor] = useState("#04f489");
  const [occupiedColor, setOccupiedColor] = useState("#b4cecf");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9000/bedGet")
      .then((response) => {
        setHospitals(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleWardChange = (ward) => {
    setSelectedWard(ward);
  };

  const handleColorPickerOpen = () => {
    setIsColorPickerOpen(true);
  };

  const handleColorPickerClose = () => {
    setIsColorPickerOpen(false);
  };

  return (
    <div style={{ display: "flex", backgroundColor: "#fff",minHeight:"1000px",maxWidth:"2000px" }}>
        <div style={{ width: "100%", padding: "10px", marginLeft: "500px", marginTop: "50px" }}>
        <Container
          maxWidth="lr"
          style={{
            display: "flex",
            width: "auto",
            height: "auto",
            marginTop: "10px",
            justifyContent: "flex-start",
            background: "#DOF6FF",
            borderRadius: "30px",
            marginLeft: "-15px",
            boxShadow: "5px 10px 6px rgba(0, 0, 0, 0.3)",
          }}
        >
    <div sx={{ minWidth: 1300,maxHeight:800}}>
        <CardContent>
        {/* Image at the top of the card */}
        {/* <img src="/path/to/your/image.jpg" alt="Bed Image" style={{ width: "100%", marginBottom: "10px" }} /> */}

        <Typography variant="h5" gutterBottom style={{ color: "gray", fontWeight: "bold", marginBottom: "20px" }}>
          Grid view
        </Typography>
        <div style={{ marginRight: "20px" }}>
          <Typography variant="h6" style={{ color: "blue", fontFamily: "Verdana, sans-serif" }}>
            Select Ward:
          </Typography>
          <Select value={selectedWard} onChange={(e) => handleWardChange(e.target.value)}>
            {hospitals.map((hospital) => (
              <MenuItem key={hospital._id} value={hospital}>
                {`${hospital.wards[0].wardName} - ${hospital.wards[0].wardType} - ${hospital.wards[0].wardId}`}
              </MenuItem>
            ))}
          </Select>
        </div>

        {selectedWard && (
          <div key={selectedWard._id} className="ward-container">
            {/* <h2 style={{ color: "green", fontFamily: "Courier New, monospace" }}>
              Ward: {selectedWard.wards[0].wardName}
            </h2> */}
            {/* <h2 style={{ color: "red", fontFamily: "Tahoma, sans-serif" }}>
              Ward ID: {selectedWard.wards[0].wardId}
            </h2>
            <h2 style={{ color: "purple", fontFamily: "Palatino Linotype, serif" }}>
              Ward Type: {selectedWard.wards[0].wardType}
            </h2> */}
            <div className="beds-container" style={{ display: "flex", flexWrap: "wrap" }}>
              {selectedWard.wards[0].beds.map((bed) => (
                <BedCard
                  key={bed._id}
                  bed={bed}
                  availableColor={availableColor}
                  occupiedColor={occupiedColor}
                  selectedWard={selectedWard} // Pass selectedWard as a prop
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardContent>
        {/* Color pickers for available and occupied statuses */}
        <div style={{ marginTop: "20px" }}>
          <Button variant="contained" color="primary" onClick={handleColorPickerOpen}>
            Open Color Picker
          </Button>
        </div>
        <Dialog open={isColorPickerOpen} onClose={handleColorPickerClose}>
          <DialogTitle>Choose Color</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: "20px" }}>
              <Typography variant="h6" style={{ marginBottom: "5px" }}>
                Available Bed Color:
              </Typography>
              <ChromePicker color={availableColor} onChange={(color) => setAvailableColor(color.hex)} />
            </div>
            <div>
              <Typography variant="h6" style={{ marginBottom: "5px" }}>
                Occupied Bed Color:
              </Typography>
              <ChromePicker color={occupiedColor} onChange={(color) => setOccupiedColor(color.hex)} />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleColorPickerClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </div>
    </Container></div></div>
  );
};

export default Bedsm;
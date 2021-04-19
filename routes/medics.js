const e = require('express');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

router.post('/csv-upload', upload.single('csv'), (req, res) => {
  // Generate mock token
  let buff = new Buffer.from(req.headers.authorization, 'base64');
  let decoded = buff.toString('ascii');
  let tokenObject = JSON.parse(decoded);

  if (
    tokenObject.roles.includes('Admin') ||
    tokenObject.roles.includes('Practitioner')
  ) {
    // CSV file
    if (req.headers['content-type'].includes('multipart/form-data')) {
      let content = fs.readFileSync(req.file.path, 'binary');
      const medics = parseCSV(content, req.file.path);

      // verify active hopsital by medic and show data

      logHospitalsByMedic(medics, tokenObject.facility);
      res.status(200).send('CSV FILE READ');
    } else {
      // JSON
      if (!req.body.id || req.body.resourceType !== 'Practitioner') {
        console.log('You are not authorized to access this.');
        res.status(401).send('You are not authorized to access this.');
      } else {
        if (req.body.active) {
          let selectedFacilities = [];
          req.body.facility.forEach((facility) => {
            if (tokenObject.facility.includes(facility.value)) {
              selectedFacilities.push(facility);
            }
          });

          selectedFacilities.forEach((facility) => {
            console.log(req.body.name[0].text + ': ' + facility.name);
          });
          res.status(200).send();
        }
      }
    }
  } else {
    console.log('You are not authorized to access this.');
    res.status(401).send('You are not authorized to access this.');
  }
});

// parse CSV date to Objects

function parseCSV(csv, path) {
  const rows = csv.split('\n');
  const rawData = rows.map((d) => d.split(','));
  const headers = rawData[0];
  const data = rawData.slice(1);
  const parsedData = data.map((row) => {
    const obj = {};
    headers.forEach((h, i) => {
      let trimmed = h.trim();
      let cammelCase = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
      obj[cammelCase] = row[i].trim();
    });
    return obj;
  });

  fs.unlink(path, () => {});

  return parsedData;
}

// verify active hopsital by medic and show data
function logHospitalsByMedic(medics, facility) {
  let hospitalsByMedic = {};

  medics.forEach((medic) => {
    if (facility.includes(medic.facilityId)) {
      let name = medic.familyName + ' ' + medic.givenName;
      hospitalsByMedic[medic.iD] = hospitalsByMedic[medic.iD] || {
        name,
        hospitals: [],
      };

      if (hospitalsByMedic[medic.iD].name !== name) {
        console.log(
          `There is already a medic saved with this id ${medic.iD} with a different name`
        );
      }

      if (medic.active === 'true') {
        hospitalsByMedic[medic.iD].hospitals.push(medic.nameId);
      }
    }
  });

  // show data
  for (const [key, value] of Object.entries(hospitalsByMedic)) {
    console.log(value.name + ': ' + value.hospitals);
  }
}

module.exports = router;

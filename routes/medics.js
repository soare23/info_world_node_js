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
      fs.unlink(req.file.path, () => {
        const rows = content.split('\n');
        const rawData = rows.map((d) => d.split(','));
        const headers = rawData[0];
        const data = rawData.slice(1);
        const medics = data.map((row) => {
          const obj = {};
          headers.forEach((h, i) => {
            let trimmed = h.trim();
            let cammelCase = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
            obj[cammelCase] = row[i].trim();
          });
          return obj;
        });

        let hospitalsByMedic = {};

        medics.forEach((medic) => {
          if (tokenObject.facility.includes(medic.facilityId)) {
            let medicName = medic.familyName + ' ' + medic.givenName;
            hospitalsByMedic[medicName] = hospitalsByMedic[medicName] || {
              hospitals: [],
            };

            if (medic.active === 'true') {
              hospitalsByMedic[medicName].hospitals.push(medic.nameId);
            }
          }
        });

        for (const [key, value] of Object.entries(hospitalsByMedic)) {
          console.log(key + ': ' + value.hospitals);
        }
      });

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

module.exports = router;

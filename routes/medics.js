const e = require('express');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

router.post('/csv-upload', upload.single('csv'), (req, res) => {
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

      let activeHospitalsByMedics = {
        medicName: '',
        hospitals: '',
      };

      console.log(medics);

      medics.forEach((medic) => {
        let hospitalsByActiveMedic = [];
        let medicName = medic.familyName + ' ' + medic.givenName;

        if (medic.active === 'true') {
          activeHospitalsByMedics.medicName = medicName;
          hospitalsByActiveMedic.push(medic.nameId);
          activeHospitalsByMedics[medicName] = hospitalsByActiveMedic;
        }
      });

      for (let key in activeHospitalsByMedics) {
        console.log(key, activeHospitalsByMedics[key]);
      }
    });

    res.status(200).send('CSV FILE READ');
  } else {
    if (!req.body.id || req.body.resourceType !== 'Practitioner') {
      console.log('error');
    } else {
      if (req.body.active) {
        console.log(req.body.name);
        console.log(req.body.facility);
      }
    }
  }
});

module.exports = router;

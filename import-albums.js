'use strict'

const csv = require('fast-csv');
const fs = require('fs');
const _ = require('lodash');

module.exports = function(mongoose) {
  const Album = mongoose.model('Album');
  const stream = fs.createReadStream('./albums.csv');

  let count = 0;

  Album.count({}).exec()
  .then(albumCount => {
    if (albumCount) {
      return
    } else {
      csv.fromStream(stream, { headers: true })
      .on('data', function(data){
        count++

        sanitizeData(data)
        .then(cleanData => {
          Album.create({
            title: cleanData.album,
            artist: cleanData.artist,
            genre: cleanData.genre,
            year: cleanData.year
          }, (err, album) => {
            if (err) console.error(err);
          });
        });
      })
      .on('end', function(){
        console.log(`Finished importing ${count} albums!`);
      });
    }
  })
}

function sanitizeData(data) {
  return new Promise((resolve, reject) => {

    let cleanData = {
      album: (data.album).replace(/[^\x20-\x7E]+/g, ''),
      artist: (data.artist).replace(/[^\x20-\x7E]+/g, ''),
      genre: (data.genre).replace(/[^\x20-\x7E]+/g, ''),
      year: (data.year).replace(/[^\x20-\x7E]+/g, '')
    }

    if (!_.isEqual(data, cleanData)) {
      console.error(`Warning: Possible unwanted characters in album titled: '${data.album}'. Check document with this title and edit as needed.`);
    }

    resolve(data);
  });
}

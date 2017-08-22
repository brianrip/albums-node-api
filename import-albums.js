const csv = require('fast-csv');
const fs = require('fs');

module.exports = function(mongoose) {
  const Album = mongoose.model('Album');
  const stream = fs.createReadStream('./albums.csv');
  let count = 0
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
          Album.create(cleanData, (err, album) => {
            if (err) console.error(err);
          });
        })
      })
      .on('end', function(){
        console.log(`Finished importing ${count} albums!`);
      });
    }
  })
}

function sanitizeData(data) {
  return new Promise((resolve, reject) => {
    resolve({
      title: (data.album).replace(/[^\x20-\x7E]+/g, ''),
      artist: (data.artist).replace(/[^\x20-\x7E]+/g, ''),
      genre: (data.genre).replace(/[^\x20-\x7E]+/g, ''),
      year: (data.year).replace(/[^\x20-\x7E]+/g, '')
    })
  });
}

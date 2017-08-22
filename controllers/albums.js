module.exports = function(app, mongoose, router) {
	const Album = mongoose.model("Album");

	router.get('/albums', (req, res) => {
		Album
			.find(req.query.where)
			.sort(req.query.sort)
			.skip(req.query.skip)
			.limit(req.query.limit)
			.select(req.query.select)
			.exec((err, albums) => {
				if (err) {
					res.status(400).json({ error: err.message });
				} else {
					res.json({ albums: albums });
				}
			});
	});

	router.post('/albums', (req, res) => {
		Album.create(req.body, (err, album) => {
			if (err) {
				res.status(400).json({ error: err.message });
			} else {
				res.json({ album: album });
			}
		});
	});

	router.get('/albums/:id', (req, res) => {
		Album.findOne({ _id: req.params.id }, (err, album) => {
			if (err) {
				res.status(400).json({ error: err.message });
			} else {
				res.json({ album: album });
			}
		});
	});

	router.put('/albums/:id', (req, res) => {
		Album.findOne({ _id: req.params.id }, (err, album) => {
			if (err) {
				res.status(400).json({ error: err.message });
			} else if (!album) {
				res.status(400).json({ error: "Album not found." });
			} else {
				for (let key in req.body) {
					album[key] = req.body[key];
				}

				album.save((err, album) => {
					if (err) {
						res.status(400).json({ error: err.message });
					} else {
						res.json({ album: album });
					}
				});
			}
		});
	});

	router.delete('/albums/:id', (req, res) => {
		Album.findOne({ _id: req.params.id }, (err, album) => {
			if (err) {
				res.status(400).json({ error: err.message });
			} else if (!album) {
				res.status(400).json({ error: "Album not found." });
			} else {
				album.remove((err, album) => {
					if (err) {
						res.status(400).json({ error: err.message });
					} else {
						res.json({ message: "Album removed successfully." });
					}
				});
			}
		});
	});
};

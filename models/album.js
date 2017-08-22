const chance = new require('chance')();

module.exports = function(config, mongoose) {
	const Schema = mongoose.Schema;
	const schema = Schema({
		title: {
			type: String,
			required: true
		},
		artist: {
			type: String,
			required: true
		},
		genre: {
			type: String,
			required: true
		},
		year: {
      type: Number,
      required: true
    }
	}, {
		timestamps: true
	});

	schema.index({ title: 1 });

	schema.pre('save', function(next) {
		return next();
	});

	/**
	 * Creates a record with randomized required parameters if not specified.
	 * @param {Object} params The parameters to initialize the record with.
	 * @param {Callback} next The callback.
	 * @param {Object} next.record The created record.
	 */
	schema.statics.mock = function(params, next) {
		if (!params.name) params.name = chance.word();
		if (!params.artist) params.artist = chance.name();
		if (!params.genre) params.genre = chance.word();
		if (!params.year) params.year = chance.year();

		this.create(params, function(err, record) {
			if (err) console.error(err);

			next(err, record);
		});
	}

	return mongoose.model('Album', schema);
}

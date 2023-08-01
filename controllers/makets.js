const { connection } = require('./db')

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

const getAllMakets = async (req, res) => {
	try {
		const resp = await connection.execute(
			`SELECT makets.id, makets.link, makets.image, makets.type, makets.language, makets.color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", makets.images, makets.features, levels.level, adaptives.adaptive  
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id 
       `
		)
		res.status(200).json({ data: resp[0] })
	} catch {
		res.status(500).json({
			status: 'error',
			message: 'Не удалось получить список, повторите попытку познее',
		})
	}
}

const getMaket = async (req, res) => {
	const { id } = req.query
	try {
		const resp = await connection.execute(
			`SELECT makets.id, makets.link, makets.image, makets.type, makets.language, makets.color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", makets.images, makets.features, levels.level, adaptives.adaptive
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id WHERE makets.id = ?`,
			[id]
		)
		res.status(200).json({ data: resp[0] })
	} catch {
		res.status(500).json({
			status: 'error',
			message: 'Не удалось получить список, повторите попытку познее',
		})
	}
}

const getMaketForOption = async (req, res) => {
	const request = req.query

	let search = 'WHERE'
	let find = ''
	if (Object.keys(request).length !== 0) {
		if (request.hasOwnProperty('page') && request.hasOwnProperty('limit')) {
			let pageOn = request.page - 1
			let limits = request.limit

			if (Object.keys(request).length > 2) {
				for (var key in request) {
					if (!key.includes('limit') && !key.includes('page')) {
						search += ` ${key} LIKE '%${request[key]}%' AND`
					}
				}
				find = search.substring(0, search.length - 3)
			} else {
				find = ''
			}

			try {
				const count = await connection.execute(
					`SELECT count(*) as count FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
					LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id ${find}`
				)

				let pages = count[0][0].count / limits

				const resp = await connection.execute(
					`SELECT makets.id, makets.link, makets.image, makets.type, makets.language, makets.color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", makets.images, makets.features, levels.level, adaptives.adaptive
			   FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
			   LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id ${find} LIMIT ${
						pageOn * limits
					},${limits}`
				)

				res.status(200).json({
					count: count[0][0].count,
					pages: Math.ceil(pages),
					data: resp[0],
				})
			} catch {
				res.status(500).json({
					status: 'error',
					message: 'Не удалось получить список, повторите попытку позднее',
				})
			}
		} else {
			for (var key in request) {
				if (!key.includes('limit') && !key.includes('page')) {
					search += ` ${key} LIKE '%${request[key]}%' AND`
				}
			}
			find = search.substring(0, search.length - 3)

			try {
				const resp = await connection.execute(
					`SELECT makets.id, makets.link, makets.image, makets.type, makets.language, makets.color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", makets.images, makets.features, levels.level, adaptives.adaptive
				   FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
				   LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id ${find}`
				)
				res.status(200).json({
					data: resp[0],
				})
			} catch {
				res.status(500).json({
					status: 'error',
					message: 'Не удалось получить список, повторите попытку позднее',
				})
			}
		}
	} else {
		try {
			const resp = await connection.execute(
				`SELECT makets.id, makets.link, makets.image, makets.type, makets.language, makets.color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", makets.images, makets.features, levels.level, adaptives.adaptive
		   FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
		   LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id`
			)
			res.status(200).json({
				data: resp[0],
			})
		} catch {
			res.status(500).json({
				status: 'error',
				message: 'Не удалось получить список, повторите попытку позднее',
			})
		}
	}
}

const getRandomMaketForOption = async (req, res) => {
	let search = ''
	for (var key in req.query) {
		search += ` ${key} LIKE '%${req.query[key]}%' OR`
	}
	const find = search.substring(0, search.length - 2)
	try {
		const resp = await connection.execute(
			`SELECT makets.id, makets.link, makets.image, makets.type, makets.language, makets.color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", makets.images, makets.features, levels.level, adaptives.adaptive
           FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
           LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id WHERE ${find}`
		)

		let arr = []

		for (let i = 0; i < 4; i++) {
			arr.push(resp[0][getRndInteger(0, resp[0].length - 1)])
		}

		res.status(200).json({ data: arr })
	} catch {
		res.status(500).json({
			status: 'error',
			message: 'Не удалось получить список, повторите попытку познее',
		})
	}
}

const getMaketPopular = async (req, res) => {
	try {
		const resp = await connection.execute(
			`SELECT makets.id, makets.link, makets.image, makets.type, makets.language, makets.color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", makets.images, makets.features, levels.level, adaptives.adaptive
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id ORDER BY makets.likes DESC`
		)

		let arr = resp[0].slice(0, 5)

		res.status(200).json({ data: arr })
	} catch {
		res.status(500).json({
			status: 'error',
			message: 'Не удалось получить список, повторите попытку познее',
		})
	}
}

const getCountMakets = async (req, res) => {
	try {
		const resp = await connection.execute(
			`SELECT COUNT(*) as count FROM makets;`
		)

		res.status(200).json({ data: resp[0] })
	} catch {
		res.status(500).json({
			status: 'error',
			message: 'Не удалось получить список, повторите попытку познее',
		})
	}
}

const getMaketsPagination = async (req, res) => {
	const { page, limits } = req.query

	let pageOn = page - 1
	let limit = limits
	try {
		const count = await connection.execute(
			`SELECT count(*) as count FROM makets`
		)

		let pages = count[0][0].count / limit

		const resp = await connection.execute(
			`SELECT makets.id, makets.link, makets.image, makets.type, makets.language, makets.color, makets.price, makets.description, makets.likes, makets.title, DATE_FORMAT(makets.date,'%Y-%m-%d') AS "date", makets.images, makets.features, levels.level, adaptives.adaptive
       FROM makets LEFT JOIN levels ON makets.level_id = levels.id 
       LEFT JOIN adaptives ON makets.adaptive_id = adaptives.id LIMIT ${
					pageOn * limit
				},${limit}`
		)
		res.status(200).json({
			count: count[0][0].count,
			pages: Math.ceil(pages),
			data: resp[0],
		})
	} catch {
		res.status(500).json({
			status: 'error',
			message: 'Не удалось получить список, повторите попытку познее',
		})
	}
}

const addMakets = async (req, res) => {
	const {
		link,
		image,
		level_id,
		type,
		adaptive_id,
		language,
		color,
		price,
		description,
		likes,
		title,
		date,
		images,
		features,
	} = req.body

	let daetOn
	if (date) {
		daetOn = date.substr(0, 10)
	} else {
		daetOn = '2023-01-01'
	}

	try {
		const resp = await connection.execute(
			`INSERT INTO makets(id, link, image, level_id, type, adaptive_id, language, color, price, description, likes, title, date, images, features) 
   VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				null,
				link,
				image,
				level_id,
				JSON.stringify(type),
				adaptive_id,
				JSON.stringify(language),
				JSON.stringify(color),
				price,
				description,
				likes,
				title,
				daetOn,
				JSON.stringify(images),
				features,
			]
		)
		console.log(resp[0])
		res.status(200).json({ data: resp[0] })
	} catch {
		res.status(500).json({
			status: 'error',
			message: 'Не удалось получить список , повторите попытку познее',
		})
	}
}

module.exports = {
	getAllMakets,
	getMaket,
	getMaketForOption,
	getRandomMaketForOption,
	getMaketPopular,
	getCountMakets,
	getMaketsPagination,
	addMakets,
}

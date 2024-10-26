async function on_load() {
	const arr = document.querySelectorAll(".container > *:not(.answer)");
	// biome-ignore lint/complexity/useArrowFunction: <explanation>
	arr.forEach(function (el, index) {
		el.style.animation = `page-load 750ms ${index * 250 + 250}ms ease forwards`;
	});
}

class answer_db {
	constructor(url) {
		this.unhashed_db;
		this.hashed_db;
	}

	fetch_answers(url) {
		fetch(url)
			.then((response) => response.json())
			.then((response) => {
				this.unhashed_db = response.unhashed;
				this.hashed_db = response.hashed;
			});
	}

	get_hash(text, img, options) {
		const hashed_text = String(CryptoJS.MD5(text));
		let hash = hashed_text;
		const img_hash = String(CryptoJS.MD5(img));
		hash += img_hash;

		const option_hash = String(CryptoJS.MD5(options.sort().join()));
		hash += option_hash;
		return hash;
	}

	get_answer(text, img_url, options) {
		const hash = this.get_hash(text, img_url, Array.from(options));
		return this.hashed_db[
			Object.keys(this.hashed_db).filter((x) => x === hash)
		];
	}
}
const answers = new answer_db();
answers.fetch_answers("answers.json");

window.onpageshow = () => on_load();

async function get_answer(text, options, img) {
	const answer_span = document.querySelector(".answer");
	answer_span.style.opacity = "0";
	const answer = answers.get_answer(
		text,
		img === "" ? undefined : img,
		Array.from(options),
	);

	if (answer.length !== 0) {
		answer_span.textContent = answer.join(", ");
	} else {
		answer_span.textContent = "Answer not found";
		console.log("Hash not found in database:", question_hash);
	}

	answer_span.style.opacity = "1";
}

document.querySelector("button").onclick = () =>
	get_answer(
		document.querySelector("#question_text").value,
		document.querySelector("#question_options").value,
		document.querySelector("#question_img").value,
	);

async function on_load() {
    const arr = document.querySelectorAll('.container > *:not(.answer)');
    arr.forEach(function(el, index) {
        el.style.animation = `page-load 750ms ${(index * 250) + 250}ms ease forwards`;
    });
}

window.onpageshow = () => on_load();

async function hash_question(question, options, imageSrc) {
    console.log("Original question:", question);

    // Step 1: MD5 Hash of the question text
    const md5_question_hex = CryptoJS.MD5(question).toString(CryptoJS.enc.Hex);
    console.log("MD5 hash of question:", md5_question_hex);

    // Step 2: Create a hash of the options if provided
    let options_hash = '';
    if (options && options.length > 0) {
        options_hash = CryptoJS.MD5(options.map(opt => opt.toLowerCase()).sort().join()).toString(CryptoJS.enc.Hex);
        console.log("MD5 hash of options:", options_hash);
    } else {
        console.log("No options provided to hash.");
    }

    // Step 3: Create a hash of the image source if provided
    let image_hash = '';
    if (imageSrc) {
        image_hash = CryptoJS.MD5(imageSrc).toString(CryptoJS.enc.Hex);
        console.log("MD5 hash of image src:", image_hash);
    } else {
        console.log("No image source provided to hash.");
    }

    // Step 4: Combine all hashes
    const combined_hash = md5_question_hex + options_hash + image_hash;
    console.log("Final combined hash:", combined_hash);

    return combined_hash;
}

async function get_answer(input) {
    const answer_span = document.querySelector('.answer');
    answer_span.style.opacity = '0';

    setTimeout(async () => {
        console.log("Fetching answers.json...");
        const response = await fetch('answers.json');
        const data = await response.json();
        
        console.log("answers.json data loaded:", data);

        // Example logic to retrieve options and image source
        const options = []; // Replace with your logic to get options
        const imageSrc = ""; // Replace with your logic to get image source

        const question_hash = await hash_question(input, options, imageSrc);
        
        console.log("Generated hash for question:", question_hash);

        // Search for the answer in the database
        if (data.hashed && data.hashed[question_hash]) {
            answer_span.textContent = data.hashed[question_hash].join(", ");
        } else {
            answer_span.textContent = "Answer not found";
            console.log("Hash not found in database:", question_hash);
        }

        answer_span.style.opacity = '1';
    }, 250);
}

document.querySelector('button').onclick = () => get_answer(document.querySelector('input').value);

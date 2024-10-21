function on_load() {
    const arr = document.querySelectorAll('.container > *:not(.answer)');
    arr.forEach(function(el, index) {
        el.style.animation = `page-load 750ms ${(index * 250) + 250}ms ease forwards`;
    })
}

window.onpageshow = () => on_load();

function get_answer(input) {
    const answer_span = document.querySelector('.answer')
    answer_span.style.opacity = '0';

    setTimeout(() => {
        // fetch('...').then(response => {
            // so some shit
            let answer = `${input} => Answer`  // example
            answer_span.textContent = answer;

            answer_span.style.opacity = '1';
        // })
    }, 250);
}

document.querySelector('button').onclick = () => get_answer(document.querySelector('input').value)
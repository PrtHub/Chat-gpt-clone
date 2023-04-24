

const SubmitElement = document.querySelector("#submit");
const InputElement = document.querySelector("#input");
const userInputElement = document.querySelector("#userInput");
const gptOutElement = document.querySelector("#gptOutput");
const userFeedElement = document.querySelector(".userFeed");
const HistoryElement = document.querySelector(".history");
const newChatElement = document.querySelector("#newChat");

const changeInput = (value) => {
    const InputElement  = document.querySelector('#input');
    InputElement.value = value
}

const handleClick = async () => {
  console.log("Clicked");

  const h1Element = document.querySelector('h1')
  h1Element.style.display = 'none';

  const feedElement = document.querySelector('.feed')
  feedElement.style.display = 'flex';

  SubmitElement.disabled = true;
  gptOutElement.textContent = "Your Content is Loading, Please wait...";
  userInputElement.textContent = "Your message...";

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: InputElement.value }],
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    console.log(data);
    gptOutElement.textContent = data.choices[0].message.content; // display the output


    if(data.choices[0].message.content && InputElement.value) {
    userInputElement.innerHTML = InputElement.value;
    // userFeedElement.append(userInputElement);
        
    const pElement = document.createElement('p');
    pElement.innerHTML = InputElement.value;
    pElement.addEventListener('click', () => changeInput(pElement.textContent));
    HistoryElement.append(pElement); 

    // localStorage
    const inputs = JSON.parse(localStorage.getItem("inputs")) || [];
    inputs.push(InputElement.value);
    localStorage.setItem("inputs", JSON.stringify(inputs));
} 
  } catch (error) {
    console.log(error);
    gptOutElement.textContent = "Sorry, an error occurred.";
    userInputElement.textContent = "Sorry, an error occurred.";
  } finally {
    // Re-enable the submit button
    SubmitElement.disabled = false;
  }
};

SubmitElement.addEventListener("click", handleClick);


const inputs = JSON.parse(localStorage.getItem('inputs')) || [];
for (const input of inputs) {
    const pElement = document.createElement('p');
    pElement.textContent = input
    pElement.addEventListener('click', () => changeInput(pElement.textContent))
  HistoryElement.append(pElement); 
}



// click on new chat and clear the input
const clearInput = () => {
  InputElement.value = "";
}

newChatElement.addEventListener('click', clearInput)

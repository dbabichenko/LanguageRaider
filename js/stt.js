window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

                const recognition = new SpeechRecognition();
                recognition.interimResults = true;
                // recognition.lang = 'en-US';
                recognition.lang = 'it';
                
                
                recognition.addEventListener('result', e => {
                    const transcript = Array.from(e.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('');

                    if (e.results[0].isFinal) {
                        console.log(transcript);
                        processTextInput(transcript);
                    }
                });

                recognition.addEventListener('end', recognition.start);

                recognition.start();
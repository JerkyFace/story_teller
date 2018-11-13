var Story = require('./models/story');

function Seeds() {
    Story.deleteMany({}, error => {
        if(!error){
            console.log('clear');
        }
        else{
            console.log(error);
        }
    });
}

module.exports = Seeds;
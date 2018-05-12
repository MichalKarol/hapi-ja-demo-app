$(document).ready(() => {
        
    const addNotification = ({type, title, message}) => {
        const notificationArea = document.getElementById('notification-area');
        const element = document.createElement('div');
        element.innerHTML = `<div class="alert alert-${type} alert-dismissible">
                                <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                                <strong>${title}</strong> ${message}
                            </div>`;
        notificationArea.appendChild(element);
        setTimeout(() => {
            element.remove();
        }, 5000);
    };

    Vue.use(VueResource)
    const app = new Vue({
        el: '#app',
        data: {
            input_model: {
                name: '',
                surname: '',
                email: '',
            },
        },
        methods: {
            submitModel: function(event) {
                this.$http.post('/api/email', this.input_model).then(
                    repsonse => addNotification({type:'success', title:'Wysyłanie', message:'Wiadomość została wysłana poprawnie.'}),
                    response => addNotification({type:'danger', title:'Wysyłanie', message:'Wiadomość została wysłana niepoprawnie.'}));
            }
        }
        // methods: {
            // submitModel: function() {
                // 
            // },
        // },
    });
});
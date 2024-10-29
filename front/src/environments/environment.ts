export const environment = {
    /*
    ------------------------
    -       Servidor         -
    --------------------------
    */
    baseUrl: 'http://localhost:9292/api',
    
    // usuarios
    login: '/login',
    register: '/register',
    sendMail: '/mail/request-reset',
    resetPassword: '/mail/reset',
    myProfile: '/userToken',
    showUser: '/user',
    activeUsers: '/users/active',
    inactiveUsers: '/users/inactive',
    deleteUsers: '/users/delete',
    activateUsers: '/users/activate',
    desactivateUsers: '/users/desactivate',
    createUser: '/user/new-user',
    updateUser: '/user',
    showFriendship: '/friendship',
    searchUser: '/users/search',
    googleSignIn: '/google',

    // preferencias
    preferences: '/userPreferences',
    getOptionsRelation: '/options/relation',
    getOptionsInterest: '/options/interest',
    optionInterest: '/preferences/options/interest',
    optionRelation: '/preferences/options/relation',
    
    // roles
    showRols: '/rols/',
    
    // chat
    showChatsUser: '/chats',
    getChatMessages: '/chats/messages',
    createChat: '/chats/new',

    // eventos
    events: '/events',
    activeEvents: '/events/show/active',
    inactiveEvents: '/events/show/inactive',
    activateEvents: '/events/update/activate',
    desactivateEvents: '/events/update/desactivate',
    searchEvent: '/events/search',
    inscriptions: '/userEvents',

    // assets
    getFile: '/assets',
    uploadAssets: '/assets/upload',
    getAssetsOfUser: '/assets/user',
    updatePhotoProfile: '/assets/photo-profile',

    //recommend
    recommend: '/recommendations',

    rol_admin : 1,
    admin_gestion_image:'../../assets/cards-dashboard/gestion.png',
    entrenador_faltas_image:'../../assets/cards-dashboard/listado.png',
    admin_card_image: '../../assets/cards-dashboard/_f85fcebc-e26f-4c23-97a8-7eefbbd9524c.jpg',
    redactor_card_image: '../../assets/cards-dashboard/_86275f07-3393-436b-bd61-2750bf845a4c.jpg',
    tutor_card_image: '../../assets/cards-dashboard/istockphoto-1345951925-640x640.jpg',
    entrenador_card_image: '../../assets/cards-dashboard/mejores_entrenamientos_natacion_2252.jpg',
    puntuacion_card_image: '../../assets/cards-dashboard/_92986fbf-d1c8-4636-9904-276b25ea2fb9.jpg',
    socio_card_image: '../../assets/cards-dashboard/Ux0VAfghQMW8GNWsoWLtgg.jpg',
    contact_card_image: '../../assets/cards-dashboard/_9edbc40b-aeca-4f56-9b1a-eed691dc871c.jpg',
    landing_card_image: '../../assets/cards-dashboard/_e251221c-5699-4e20-9039-e2bf409da53d.jpg',
    gestion_eventos_image: '../../assets/cards-dashboard/gestionEventos.jpg',
};
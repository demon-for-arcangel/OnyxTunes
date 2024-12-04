export const environment = {
    /*
    ------------------------
    -       Servidor         -
    --------------------------
    */
    baseUrl: 'http://localhost:9292/api',
    socketUrl: 'http://localhost:9292',
    usersUrl: '/users',
    songsUrl: '/songs',
    rolesUrl: '/roles',
    generosUrl: '/genero',
    albumsUrl: '/albums',
    chatsUrl: '/chats',
    playlistUrl: '/playlist',
    
    // usuarios

    sendMail: '/mail/request-reset', //por hacer
    resetPassword: '/mail/reset', //por hacer
    myProfile: '/userToken', //por hacer
    showUser: '/user', //por hacer
    activeUsers: '/users/active', //mirar si es necesario o no
    inactiveUsers: '/users/inactive', //mirar si es necesario o no
    deleteUsers: '/users/delete', //por hacer
    activateUsers: '/users/activate', //mirar si es necesario o no
    desactivateUsers: '/users/desactivate', //mirar si es necesario o no
    createUser: '/user/new-user', //por hacer
    updateUser: '/user', //por hacer
    showFriendship: '/friendship', //por hacer
    searchUser: '/users/search', //por hacer
    googleSignIn: '/google', //por hacer
    
    // roles
    showRols: '/rols/',
    
    // chat
    showChatsUser: '/chats',
    getChatMessages: '/chats/messages',
    createChat: '/chats/new',

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
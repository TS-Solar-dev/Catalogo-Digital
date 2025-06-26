document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS DOS PRODUTOS ---
    const products = [
        { id: 'placas', name: 'PLACAS COLETORAS', subtitle: 'AQUECIMENTO SOLAR DE PISCINAS', description: 'Nossos coletores (CPTS-200 a 500) se destacam pela alta eficiência e compromisso ambiental. Feitos de material 100% virgem e sem metais pesados, garantem uma piscina aquecida de forma limpa e segura.', image: 'COLETOR.png', features: [ { title: 'Alças duplas', text: 'Maior segurança na fixação.', icon: 'ORELINHA.png' }, { title: 'Membrana entre tubos', text: 'Aumenta a eficiência energética.', icon: 'COLETOR2.png' }, { title: 'Chave Auxiliar', text: 'Reforço da segurança da instalação.', icon: 'CHAVE.png' } ], buttons: [ { text: 'Ficha Técnica', action: 'openModal', target: 'specs' }, { text: 'Kit Fechamento', action: 'openModal', target: 'kit' } ], specImage: 'TABELA.png' },
        { id: 'valvula-quebra', name: 'VÁLVULA QUEBRA VÁCUO', subtitle: 'ESSENCIAL P/ DURABILIDADE', description: 'A Válvula Quebra Vácuo impede a implosão dos coletores solares, aliviando a pressão negativa que ocorre quando a motobomba é desligada e a água retorna. Item crucial para a segurança e longevidade do seu aquecimento.', image: 'VQV.png' },
        { id: 'valvula-retencao', name: 'VÁLVULA DE RETENÇÃO', subtitle: 'GARANTE O FLUXO CORRETO', description: 'Esta válvula assegura que a água flua em uma única direção, do filtro para os coletores, impedindo o retorno indesejado e garantindo que o sistema funcione com máxima eficiência.', image: 'VR.png' },
        { id: 'controlador', name: 'CONTROLADOR DIGITAL', subtitle: 'INTELIGÊNCIA E AUTOMAÇÃO', description: 'O Controlador Digital de Temperatura automatiza o processo de aquecimento, acionando a bomba apenas quando há sol suficiente para aquecer a piscina, otimizando o consumo de energia e mantendo a temperatura ideal.', image: 'CONTROLADOR.png' },
        { id: 'aquecedor', name: 'AQUECEDOR DE BANHEIRA', subtitle: 'CONFORTO E TECNOLOGIA', description: 'Nosso aquecedor de banheira oferece um banho relaxante e na temperatura perfeita. Com painel de comando digital e componentes de alta durabilidade, é a escolha ideal para o seu conforto.', image: 'AQUECEDOR.png', buttons: [ { text: 'Especificações Técnicas', action: 'openModal', target: 'specs' }, { text: 'Painel', action: 'openModal', target: 'panel' } ], specImage: 'TABELAAQUECEDOR.png' }
    ];

    // --- SELETORES DO DOM ---
    const mainContentScreen = document.getElementById('main-content-screen');
    const finalScreen = document.getElementById('final-screen');
    const typewriterContainer = document.getElementById('typewriter-container');
    const typewriterTextEl = document.getElementById('typewriter-text');
    const productsTitleContainer = document.getElementById('products-title-container');
    const productsSection = document.getElementById('products-section');
    const mainProductDisplay = document.getElementById('main-product-display');
    const galleryTrack = document.getElementById('product-gallery-track'); // Alterado
    const finishVisitBtn = document.getElementById('finish-visit-btn');
    const fixedPhoneLink = document.getElementById('fixed-phone-link');
    const fixedPhoneMessage = document.getElementById('fixed-phone-message');
    const modalOverlay = document.getElementById('modal-overlay');
    const allModals = document.querySelectorAll('.modal-content');
    const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
    const skipIntroBtn = document.getElementById('skip-intro-btn');
    const musicToggleBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');

    // --- ESTADO DA APLICAÇÃO ---
    let currentProductIndex = 0;
    let sequenceTimeout;

    // --- FUNÇÕES ---

    const typeWriter = (element, text, speed, onComplete) => {
        let i = 0;
        element.innerHTML = '';
        const cursor = '<span class="cursor"> </span>';
        element.innerHTML = cursor;
        const typing = () => {
            if (i < text.length) {
                element.innerHTML = text.substring(0, i + 1) + cursor; i++; sequenceTimeout = setTimeout(typing, speed);
            } else {
                element.innerHTML = text; if (onComplete) onComplete();
            }
        };
        typing();
    };

    const renderMainProduct = (product) => {
        mainProductDisplay.style.opacity = '0';
        setTimeout(() => {
            mainProductDisplay.innerHTML = `
                <div class="product-image-container"> <img src="${product.image}" alt="${product.name}"> </div>
                <div class="product-details">
                    <h2>${product.name}</h2> <p class="subtitle">${product.subtitle}</p> <p class="description">${product.description}</p>
                    ${product.features ? `<div class="product-features">${product.features.map(feature => `<div class="feature-item"><div class="icon"><img src="${feature.icon}" alt=""></div><div><h4>${feature.title}</h4><p>${feature.text}</p></div></div>`).join('')}</div>` : ''}
                    ${product.buttons ? `<div class="product-buttons">${product.buttons.map(button => `<button class="btn btn-primary" data-action="${button.action}" data-target="${button.target}">${button.text}</button>`).join('')}</div>` : ''}
                </div>`;
            mainProductDisplay.querySelectorAll('[data-action="openModal"]').forEach(btn => {
                btn.addEventListener('click', () => openModal(btn.dataset.target, product));
            });
            mainProductDisplay.style.opacity = '1';
        }, 200);
    };
    
    // --- LÓGICA DA NOVA GALERIA FIXA ---
    const setupGallery = () => {
        galleryTrack.innerHTML = products.map((product, index) => `
            <div class="gallery-item" data-index="${index}">
                <img src="${product.image}" alt="${product.name}">
                <div class="gallery-item-info"><h4>${product.name}</h4><p>${product.subtitle}</p></div>
            </div>`).join('');

        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                selectGalleryItem(index);
            });
        });
        
        selectGalleryItem(0, true); // Seleciona o primeiro item inicialmente
    };

    const selectGalleryItem = (index, isInitial = false) => {
        if (!isInitial && currentProductIndex === index) return; // Não faz nada se já estiver selecionado

        currentProductIndex = index;
        
        if (!isInitial) {
            renderMainProduct(products[currentProductIndex]);
        }

        document.querySelectorAll('.gallery-item').forEach((item, itemIndex) => {
            if (itemIndex === currentProductIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    };
    // --- FIM DA LÓGICA DA GALERIA ---

    const openModal = (modalId, product) => {
        allModals.forEach(m => m.classList.add('hidden'));
        const modalToShow = document.getElementById(`modal-${modalId}`);
        if (modalId === 'specs' && product.specImage) {
            document.getElementById('modal-specs-image').src = product.specImage;
        }
        modalOverlay.classList.remove('hidden');
        if (modalToShow) modalToShow.classList.remove('hidden');
    };

    const closeModal = () => modalOverlay.classList.add('hidden');

    const jumpToProducts = () => {
        clearTimeout(sequenceTimeout);
        document.body.classList.remove('loading-state');
        skipIntroBtn.classList.remove('visible');
        typewriterContainer.classList.remove('visible');
        typewriterContainer.classList.add('hidden');
        productsTitleContainer.innerHTML = `<h2 class="products-main-title">Conheça nossos produtos</h2>`;
        productsSection.classList.add('visible');
        renderMainProduct(products[0]);
        setupGallery();
    };

    const startSequence = () => {
        document.body.classList.add('loading-state');
        skipIntroBtn.classList.add('visible');

        const mainText = `O calor do sol é uma fonte renovável de energia, mais limpa e abundante existente no planeta. Desejamos contribuir para o desenvolvimento econômico, qualidade ambiental e de vida da sociedade através dos nossos produtos e equipamentos.\n\nNa TS.Solar, utilizamos material 100% virgem, livre de chumbo. Assim, sua piscina continua livre de materiais pesados, enquanto se mantém quentinha.`;
        
        sequenceTimeout = setTimeout(() => {
            document.body.classList.remove('loading-state');
            
            sequenceTimeout = setTimeout(() => {
                typewriterContainer.classList.add('visible');
                typeWriter(typewriterTextEl, mainText, 25, () => {
                    sequenceTimeout = setTimeout(() => {
                        // Esconde o botão e o texto para mostrar os produtos
                        skipIntroBtn.classList.remove('visible'); 
                        typewriterContainer.classList.add('fading-out');
                        productsTitleContainer.innerHTML = `<h2 class="products-main-title">Conheça nossos produtos</h2>`;
                        
                        sequenceTimeout = setTimeout(() => {
                           typewriterContainer.classList.add('hidden');
                           productsSection.classList.add('visible');
                           renderMainProduct(products[0]);
                           setupGallery();
                        }, 500);
                    }, 2000);
                });
            }, 1000); // Aumentado um pouco o delay para a logo assentar
        }, 2500); 
    };

    // --- EVENT LISTENERS ---
    finishVisitBtn.addEventListener('click', () => {
        mainContentScreen.classList.add('fading-out');
        setTimeout(() => {
            mainContentScreen.classList.add('hidden');
            finalScreen.classList.add('visible');
        }, 600);
    });
    
    fixedPhoneLink.addEventListener('click', (e) => {
        e.preventDefault();
        fixedPhoneMessage.classList.add('show-message');
        setTimeout(() => {
            fixedPhoneMessage.classList.remove('show-message');
        }, 3000);
    });
    
    skipIntroBtn.addEventListener('click', jumpToProducts);

    musicToggleBtn.addEventListener('click', () => {
        musicToggleBtn.classList.toggle('muted');
        if (bgMusic.paused) {
            bgMusic.volume = 0.2;
            bgMusic.play().catch(e => console.log("A reprodução automática foi bloqueada pelo navegador."));
        } else {
            bgMusic.pause();
        }
    });

    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
    modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));

    // --- INICIA A PÁGINA ---
    startSequence();
});
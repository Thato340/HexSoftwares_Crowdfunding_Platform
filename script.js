const sampleProjects = [
    {
        id: 1,
        name: "Cape Town Art Collective",
        description: "Support local artists from the Cape Town township communities to showcase their work.",
        goal: 50000,
        raised: 32500,
        category: "art",
        color: "#ff6b6b"
    },
    {
        id: 2,
        name: "Johannesburg Tech Hub",
        description: "Funding for a new coding bootcamp to train underprivileged youth in Soweto.",
        goal: 250000,
        raised: 120000,
        category: "tech",
        color: "#4ecdc4"
    },
    {
        id: 3,
        name: "Durban Food Garden",
        description: "Community vegetable garden project to fight food insecurity in KwaZulu-Natal.",
        goal: 80000,
        raised: 45000,
        category: "food",
        color: "#ffbe0b"
    }
];


const projectsGrid = document.getElementById('projects-grid');
const projectForm = document.getElementById('project-form');
const bankModal = document.getElementById('bank-modal');
const closeBtn = document.querySelector('.close-btn');
const paymentMethods = document.querySelectorAll('.payment-method');
const eftForm = document.getElementById('eft-form');
const cardForm = document.getElementById('card-form');
const confirmEftBtn = document.getElementById('confirm-eft');
const confirmCardBtn = document.getElementById('confirm-card');
const paymentAmount = document.getElementById('payment-amount');
const cardAmount = document.getElementById('card-amount');
const projectReference = document.getElementById('project-reference');
const modalProjectTitle = document.getElementById('modal-project-title');


let currentProjectId = null;
let currentAmount = 0;


function displayProjects() {
    projectsGrid.innerHTML = '';
    
    const allProjects = [...sampleProjects];
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    allProjects.push(...savedProjects);
    
    if (allProjects.length === 0) {
        projectsGrid.innerHTML = '<p class="no-projects">No projects yet. Be the first to create one!</p>';
        return;
    }
    
    allProjects.forEach(project => {
        const progress = Math.min(Math.floor((project.raised / project.goal) * 100), 100);
        
        const categoryNames = {
            art: "Art & Culture",
            tech: "Technology",
            food: "Food & Agriculture",
            education: "Education",
            community: "Community"
        };
        
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.style.borderTop = `5px solid ${project.color}`;
        
        projectCard.innerHTML = `
            <div class="project-header" style="background-color: ${project.color}">
                <span class="project-category">${categoryNames[project.category]}</span>
            </div>
            <div class="project-body">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-stats">
                    <span>R${project.raised.toLocaleString()} raised</span>
                    <span>${progress}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%; background-color: ${project.color}"></div>
                </div>
                <button class="cta-button" style="background: ${project.color}" onclick="openPaymentModal(${project.id}, '${project.name.replace(/'/g, "\\'")}')">Support This Project</button>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
}


projectForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newProject = {
        id: Date.now(),
        name: document.getElementById('project-name').value,
        description: document.getElementById('project-desc').value,
        goal: parseInt(document.getElementById('project-goal').value),
        raised: 0,
        category: document.getElementById('project-category').value,
        color: document.getElementById('project-color').value
    };
    
    
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    savedProjects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(savedProjects));
    
    
    projectForm.reset();
    document.getElementById('project-color').value = '#ff6b6b';
    
    
    alert('Your South African project has been created successfully!');
    
    
    displayProjects();
    
    
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
});


function openPaymentModal(projectId, projectName) {
    const amount = prompt(`How much would you like to contribute to "${projectName}"? (Enter amount in ZAR)`);
    
    if (!amount || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount in South African Rand (ZAR).');
        return;
    }
    
    currentProjectId = projectId;
    currentAmount = parseFloat(amount);
    
    
    modalProjectTitle.textContent = `Support: ${projectName}`;
    paymentAmount.textContent = currentAmount.toFixed(2);
    cardAmount.textContent = currentAmount.toFixed(2);
    projectReference.textContent = `PROJ${projectId}`;
    
    
    bankModal.style.display = 'block';
}

function closeModal() {
    bankModal.style.display = 'none';
}


paymentMethods.forEach(method => {
    method.addEventListener('click', function() {
        paymentMethods.forEach(m => m.classList.remove('active'));
        this.classList.add('active');
        
        if (this.dataset.method === 'eft') {
            eftForm.style.display = 'block';
            cardForm.style.display = 'none';
        } else {
            eftForm.style.display = 'none';
            cardForm.style.display = 'block';
        }
    });
});


confirmEftBtn.addEventListener('click', function() {
    
    updateProjectFunding(currentProjectId, currentAmount);
    alert(`Thank you! Please transfer R${currentAmount.toFixed(2)} to the provided bank account. Your support will be processed within 2-3 business days.`);
    closeModal();
});


confirmCardBtn.addEventListener('click', function() {
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    
    if (!cardNumber || !expiry || !cvv) {
        alert('Please fill in all card details');
        return;
    }
    
    
    confirmCardBtn.disabled = true;
    confirmCardBtn.textContent = 'Processing...';
    
    setTimeout(() => {
        updateProjectFunding(currentProjectId, currentAmount);
        alert(`Payment of R${currentAmount.toFixed(2)} successful! Thank you for your support.`);
        closeModal();
        confirmCardBtn.disabled = false;
        confirmCardBtn.textContent = `Pay ZAR ${currentAmount.toFixed(2)}`;
    }, 2000);
});


function updateProjectFunding(projectId, amount) {
    const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    const projectIndex = savedProjects.findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
        savedProjects[projectIndex].raised += amount;
        localStorage.setItem('projects', JSON.stringify(savedProjects));
        displayProjects();
    } else {
        
        const sampleIndex = sampleProjects.findIndex(p => p.id === projectId);
        if (sampleIndex !== -1) {
            sampleProjects[sampleIndex].raised += amount;
            displayProjects();
        }
    }
}


closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', function(e) {
    if (e.target === bankModal) {
        closeModal();
    }
});


displayProjects();
var users = [
    { username: "admin", password: "123", isAdmin: true },
    { username: "rcs", password: "123", isAdmin: false },
    // Adicione mais usuários conforme necessário
  ];
  
  var surveyResults = [];
  
  document.getElementById("login-btn").addEventListener("click", function() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
  
    var authenticatedUser = authenticateUser(username, password);
  
    if (authenticatedUser) {
      document.getElementById("login-container").style.display = "none";
      if (authenticatedUser.isAdmin) {
        document.getElementById("survey-container").style.display = "none";
        generateChart();
        document.getElementById("results-container").style.display = "block";
      } else {
        document.getElementById("survey-container").style.display = "block";
      }
    } else {
      alert("Usuário ou senha inválidos!");
    }
  });
  
  document.getElementById("signup-btn").addEventListener("click", function() {
    var username = document.getElementById("signup-username").value;
    var password = document.getElementById("signup-password").value;
  
    if (username && password) {
      var newUser = {
        username: username,
        password: password,
        isAdmin: false
      };
  
      users.push(newUser);
      document.getElementById("signup-container").style.display = "none";
      document.getElementById("survey-container").style.display = "block";
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  });
  
  document.getElementById("no-account-btn").addEventListener("click", function() {
    var username = document.getElementById("no-account-username").value;
    var password = document.getElementById("no-account-password").value;
  
    var newUser = {
      username: username,
      password: password,
      isAdmin: false
    };
  
    users.push(newUser);
    document.getElementById("no-account-container").style.display = "none";
    document.getElementById("survey-container").style.display = "block";
  });
  
  document.getElementById("submit-btn").addEventListener("click", function() {
    var scores = [];
    var inputs = document.getElementsByTagName("input");
  
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type === "number") {
        scores.push(parseInt(inputs[i].value));
      }
    }
  
    if (scores.length === 0) {
      alert("Por favor, responda todas as perguntas antes de enviar.");
      return;
    }
  
    var result = {
      timestamp: new Date().toISOString(),
      scores: scores
    };
  
    surveyResults.push(result);
  
    var username = document.getElementById("username").value;
    var authenticatedUser = authenticateUser(username, "");
  
    if (authenticatedUser && authenticatedUser.isAdmin) {
      updateChart(); // Atualiza o gráfico
      document.getElementById("survey-container").style.display = "none";
      document.getElementById("results-container").style.display = "block";
    } else {
      alert("Pesquisa enviada com sucesso!");
      clearForm();
    }
  });
  
  function authenticateUser(username, password) {
    for (var i = 0; i < users.length; i++) {
      if (users[i].username === username && users[i].password === password) {
        return users[i];
      }
    }
    return null;
  }
  
  function generateChart() {
    var npsChart = document.getElementById("nps-chart").getContext("2d");
    var data = {
      labels: ["CD300", "CD590", "CD1100", "CD", "P5", "P6", "P7", "P8", "P9", "P10"],
      datasets: [{
        label: "NPS",
        data: calculateAverageScores(),
        backgroundColor: "blue"
      }]
    };
    var options = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 10
        }
      }
    };
    new Chart(npsChart, {
      type: "bar",
      data: data,
      options: options
    });
  }
  
  function calculateAverageScores() {
    var totalScores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var totalResponses = 0;
  
    for (var i = 0; i < surveyResults.length; i++) {
      var scores = surveyResults[i].scores;
      for (var j = 0; j < scores.length; j++) {
        totalScores[j] += scores[j];
      }
      totalResponses++;
    }
  
    var averageScores = [];
    for (var k = 0; k < totalScores.length; k++) {
      averageScores.push(totalScores[k] / totalResponses);
    }
  
    return averageScores;
  }
  
  function clearForm() {
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type === "number") {
        inputs[i].value = "";
      }
    }
  }
  
  function updateChart() {
    var npsChart = document.getElementById("nps-chart").getContext("2d");
    var chartInstance = Chart.getChart(npsChart);
  
    if (chartInstance) {
      chartInstance.destroy(); // Destroi o gráfico existente
    }
  
    generateChart(); // Gera o novo gráfico com os dados atualizados
  }
  
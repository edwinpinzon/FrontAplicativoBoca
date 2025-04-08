$(document).ready(function() {
  // Configurar fecha mínima (hoy)
  const hoy = new Date().toISOString().split('T')[0];
  $('#fecha').attr('min', hoy);
  
  // Manejar el envío del formulario
  $('#formCompetencia').submit(function(e) {
    e.preventDefault();
    
    // Validar formulario
    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }
    
    // Crear objeto con los datos
    const nuevaCompetencia = {
      nombre: $('#nombre').val(),
      codigo: $('#codigo').val(),
      fecha: $('#fecha').val(),
      hora: $('#hora').val(),
      duracion: $('#duracion').val(),
      descripcion: $('#descripcion').val(),
      estado: $('#estado').val()
    };
    
    // Obtener competencias existentes o crear array vacío
    let competencias = JSON.parse(localStorage.getItem('competencias')) || [];
    
    // Verificar si el código ya existe
    const codigoExistente = competencias.some(comp => comp.codigo === nuevaCompetencia.codigo);
    
    if (codigoExistente) {
      alert('Ya existe una competencia con este código. Por favor, usa un código único.');
      return;
    }
    
    // Agregar nueva competencia
    competencias.push(nuevaCompetencia);
    
    // Guardar en localStorage
    localStorage.setItem('competencias', JSON.stringify(competencias));
    
    // Redirigir a la página principal
    window.location.href = '/pages/1 - FormularioPrincipal.html';
  });
});
$(document).ready(function() {
  // Variables globales
  let competencias = JSON.parse(localStorage.getItem('competencias')) || [];
  let competenciaEditando = null;
  
  // Inicializar la tabla
  function cargarCompetencias() {
    const $tbody = $('#tablaCompetencias tbody');
    $tbody.empty();
    
    if (competencias.length === 0) {
      $tbody.append('<tr><td colspan="7" class="text-center">No hay competencias registradas</td></tr>');
      return;
    }
    
    competencias.forEach((competencia, index) => {
      const fechaFormateada = formatearFecha(competencia.fecha);
      const estadoClass = competencia.estado || 'Programada';
      
      const $fila = $(`
        <tr data-id="${index}">
          <td>${competencia.nombre}</td>
          <td>${fechaFormateada}</td>
          <td>${competencia.hora || '--:--'}</td>
          <td>${competencia.duracion} min</td>
          <td>${competencia.descripcion || '--'}</td>
          <td><span class="estado ${estadoClass}">${estadoClass}</span></td>
          <td class="acciones">
            <button class="btn editar">Editar</button>
            <button class="btn rojo eliminar">Eliminar</button>
          </td>
        </tr>
      `);
      
      $tbody.append($fila);
    });
  }
  
  // Formatear fecha de YYYY-MM-DD a DD/MM/YYYY
  function formatearFecha(fechaISO) {
    if (!fechaISO) return '--/--/----';
    const [anio, mes, dia] = fechaISO.split('-');
    return `${dia}/${mes}/${anio}`;
  }
  
  // Mostrar modal
  function mostrarModal(idModal) {
    $(idModal).addClass('visible');
    $('body').css('overflow', 'hidden');
  }
  
  // Ocultar modal
  function ocultarModal(idModal) {
    $(idModal).removeClass('visible');
    $('body').css('overflow', 'auto');
  }
  
  // Mostrar mensaje de éxito
  function mostrarExito(mensaje) {
    $('#mensajeExitoTexto').text(mensaje);
    mostrarModal('#modalExito');
  }
  
  // Evento para abrir modal de nueva competencia
  $('#nuevaCompetencia').click(function() {
    window.location.href = '3 - FormularioCrearCompetencia.html';
  });
  
  // Evento para editar competencia
  $(document).on('click', '.editar', function() {
    const $fila = $(this).closest('tr');
    const id = $fila.data('id');
    competenciaEditando = competencias[id];
    
    // Llenar el modal con los datos
    $('#editNombre').val(competenciaEditando.nombre);
    $('#editFecha').val(competenciaEditando.fecha);
    $('#editHora').val(competenciaEditando.hora || '00:00');
    $('#editDuracion').val(competenciaEditando.duracion);
    $('#editDescripcion').val(competenciaEditando.descripcion || '');
    $('#editEstado').val(competenciaEditando.estado || 'Programada');
    
    mostrarModal('#modalEdicion');
  });
  
  // Evento para guardar cambios
  $('#guardarCambios').click(function() {
    if (competenciaEditando) {
      // Actualizar los datos
      competenciaEditando.nombre = $('#editNombre').val();
      competenciaEditando.fecha = $('#editFecha').val();
      competenciaEditando.hora = $('#editHora').val();
      competenciaEditando.duracion = $('#editDuracion').val();
      competenciaEditando.descripcion = $('#editDescripcion').val();
      competenciaEditando.estado = $('#editEstado').val();
      
      // Guardar en localStorage
      localStorage.setItem('competencias', JSON.stringify(competencias));
      
      // Recargar la tabla
      cargarCompetencias();
      
      // Cerrar modal y mostrar mensaje
      ocultarModal('#modalEdicion');
      mostrarExito('Competencia actualizada correctamente');
      
      competenciaEditando = null;
    }
  });
  
  // Evento para eliminar competencia
  $(document).on('click', '.eliminar', function() {
    const $fila = $(this).closest('tr');
    const id = $fila.data('id');
    
    // Guardar referencia a la competencia a eliminar
    competenciaEditando = competencias[id];
    
    mostrarModal('#modalEliminar');
    
    // Confirmar eliminación
    $('#confirmarEliminar').off('click').on('click', function() {
      // Eliminar del array
      competencias.splice(id, 1);
      
      // Guardar en localStorage
      localStorage.setItem('competencias', JSON.stringify(competencias));
      
      // Recargar la tabla
      cargarCompetencias();
      
      // Cerrar modal y mostrar mensaje
      ocultarModal('#modalEliminar');
      mostrarExito('Competencia eliminada correctamente');
      
      competenciaEditando = null;
    });
  });
  
  // Eventos para cerrar modales
  $('.cerrar-modal, #cancelarEdicion, #cancelarEliminar, #cerrarExito').click(function() {
    const $modal = $(this).closest('.modal');
    ocultarModal($modal);
  });
  
  // Cerrar modal al hacer clic fuera del contenido
  $(document).click(function(e) {
    if ($(e.target).hasClass('modal')) {
      ocultarModal($(e.target));
    }
  });
  
  // Cargar las competencias al iniciar
  cargarCompetencias();
});
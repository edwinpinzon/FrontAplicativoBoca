$(document).ready(function() {
    // Variables globales
    let problemas = JSON.parse(localStorage.getItem('problemas')) || [];
    let problemaEditando = null;
    
    // Inicializar la tabla
    function cargarProblemas() {
      const $tbody = $('#tablaProblemas tbody');
      $tbody.empty();
      
      if (problemas.length === 0) {
        $tbody.append('<tr><td colspan="5" class="text-center">No hay problemas registrados</td></tr>');
        return;
      }
      
      problemas.forEach((problema, index) => {
        const $fila = $(`
          <tr data-id="${index}">
            <td>${problema.titulo}</td>
            <td>${problema.categoria}</td>
            <td>${problema.tiempoLimite}</td>
            <td>${problema.memoriaLimite}</td>
            <td class="acciones">
              <button class="accion editar">Editar</button>
              <button class="accion eliminar">Eliminar</button>
            </td>
          </tr>
        `);
        
        $tbody.append($fila);
      });
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
    
    // Manejar envío del formulario
    $('#formProblema').submit(function(e) {
      e.preventDefault();
      
      // Validar formulario
      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }
      
      // Crear objeto con los datos
      const nuevoProblema = {
        titulo: $('#titulo').val(),
        categoria: $('#categoria').val(),
        descripcion: $('#descripcion').val(),
        tiempoLimite: $('#tiempoLimite').val(),
        memoriaLimite: $('#memoriaLimite').val()
      };
      
      // Agregar nuevo problema
      problemas.push(nuevoProblema);
      
      // Guardar en localStorage
      localStorage.setItem('problemas', JSON.stringify(problemas));
      
      // Limpiar formulario
      this.reset();
      
      // Recargar la tabla
      cargarProblemas();
    });
    
    // Evento para editar problema
    $(document).on('click', '.editar', function() {
      const $fila = $(this).closest('tr');
      const id = $fila.data('id');
      problemaEditando = problemas[id];
      
      // Llenar el modal con los datos
      $('#editTitulo').val(problemaEditando.titulo);
      $('#editCategoria').val(problemaEditando.categoria);
      $('#editDescripcion').val(problemaEditando.descripcion || '');
      $('#editTiempo').val(problemaEditando.tiempoLimite);
      $('#editMemoria').val(problemaEditando.memoriaLimite);
      
      mostrarModal('#modalEdicion');
    });
    
    // Evento para guardar cambios
    $('#guardarCambios').click(function() {
      if (problemaEditando) {
        // Actualizar los datos
        problemaEditando.titulo = $('#editTitulo').val();
        problemaEditando.categoria = $('#editCategoria').val();
        problemaEditando.descripcion = $('#editDescripcion').val();
        problemaEditando.tiempoLimite = $('#editTiempo').val();
        problemaEditando.memoriaLimite = $('#editMemoria').val();
        
        // Guardar en localStorage
        localStorage.setItem('problemas', JSON.stringify(problemas));
        
        // Recargar la tabla
        cargarProblemas();
        
        // Cerrar modal
        ocultarModal('#modalEdicion');
        
        problemaEditando = null;
      }
    });
    
    // Evento para eliminar problema
    $(document).on('click', '.eliminar', function() {
      const $fila = $(this).closest('tr');
      const id = $fila.data('id');
      
      // Guardar referencia al problema a eliminar
      problemaEditando = problemas[id];
      
      mostrarModal('#modalEliminar');
      
      // Confirmar eliminación
      $('#confirmarEliminar').off('click').on('click', function() {
        // Eliminar del array
        problemas.splice(id, 1);
        
        // Guardar en localStorage
        localStorage.setItem('problemas', JSON.stringify(problemas));
        
        // Recargar la tabla
        cargarProblemas();
        
        // Cerrar modal
        ocultarModal('#modalEliminar');
        
        problemaEditando = null;
      });
    });
    
    // Eventos para cerrar modales
    $('.cerrar-modal, #cancelarEdicion, #cancelarEliminar').click(function() {
      const $modal = $(this).closest('.modal');
      ocultarModal($modal);
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    $(document).click(function(e) {
      if ($(e.target).hasClass('modal')) {
        ocultarModal($(e.target));
      }
    });
    
    // Cargar los problemas al iniciar
    cargarProblemas();
  });
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../app/services/producto.service'

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ejemplo3';

  // Propiedades
  producto = {
    id: '',
    descripcion: '',
    precio: 0
  };

  productos = [
    { id: '1', descripcion: 'Taco de pastor', precio: 18 },
    { id: '2', descripcion: 'Taco de suadero', precio: 17 },
    { id: '3', descripcion: 'Quesadilla', precio: 24.40 },
    { id: '4', descripcion: 'Charola', precio: 120 },
    { id: '5', descripcion: 'Taco de sal', precio: 1.50 }
  ];

  // Constructor
  constructor(@Inject(ProductoService) private productoService: ProductoService) {}

  // Función para agregar un producto al arreglo
  agregarProducto() {
    // Validamos si el producto tiene ID
    if (!this.producto.id) {
      alert('El ID debe ser proporcionado');
      return;
    }

    // Verificamos que el ID no esté repetido
    for (let i = 0; i < this.productos.length; i++) {
      if (this.producto.id == this.productos[i].id) {
        alert('El ID ya existe');
        return;
      }
    }

    // Agregamos el producto al arreglo
    this.productos.push({
      id: this.producto.id,
      descripcion: this.producto.descripcion,
      precio: this.producto.precio
    });

    // Llamamos al servicio para agregar el producto en Firestore
    this.productoService.agregarProducto(this.producto);

    // Reiniciamos los campos del formulario
    this.producto.id = '';
    this.producto.descripcion = '';
    this.producto.precio = 0;
  }

  // Función para seleccionar un producto existente
  seleccionarProducto(productoSeleccionado: { id: string; descripcion: string; precio: number }) {
    this.producto.id = productoSeleccionado.id;
    this.producto.descripcion = productoSeleccionado.descripcion;
    this.producto.precio = productoSeleccionado.precio;
  }

  // Función para modificar un producto
  modificarProducto() {
    for (let i = 0; i < this.productos.length; i++) {
      if (this.producto.id == this.productos[i].id) {
        this.productos[i].descripcion = this.producto.descripcion;
        this.productos[i].precio = this.producto.precio;

        // Llamamos al servicio para modificar el producto en Firestore
        this.productoService.modificarProducto(this.producto);

        // Reiniciamos los campos del formulario
        this.producto.id = '';
        this.producto.descripcion = '';
        this.producto.precio = 0;
        return;
      }
    }

    alert('El ID no existe');
  }

  // Función para eliminar un producto
  eliminarProducto(id: string) {
    for (let i = 0; i < this.productos.length; i++) {
      if (id == this.productos[i].id) {
        this.productos.splice(i, 1);

        // Llamamos al servicio para eliminar el producto de Firestore
        this.productoService.eliminarProducto(this.producto);

        return;
      }
    }

    alert('El ID no existe');
  }
}

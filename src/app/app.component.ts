import { Component } from '@angular/core';
import { Producto } from './models/producto.model';
import { ProductoService } from './services/producto.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule, FormsModule], // 📌 Asegura que RouterModule está importado
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ejemplo3';

  productos: Producto[] = [];
  producto = new Producto();
  isEditing = false;  // Nueva variable que controla si estamos en modo de edición

  constructor(private productoService: ProductoService) {
    this.getProductos();
  }

  // 🔥 🔹 Solución al error de tipado: Convertir DocumentData a Producto[]
  async getProductos(): Promise<void> {
    const data = await firstValueFrom(this.productoService.getProductos());
    this.productos = data.map(doc => ({
      id: doc.id as string,
      descripcion: doc['descripcion'] as string,
      precio: doc['precio'] as number
    }));
  }

  async agregarProducto() {
    if (!this.producto.id || !this.producto.descripcion || this.producto.precio <= 0) {
      alert('El producto debe tener un ID, una descripción y un precio válido.');
      return;
    }
  
    await this.productoService.agregarProducto(this.producto);
    this.getProductos();
    this.producto = new Producto(); // Limpia el formulario
    this.isEditing = false; // Restablece el estado de edición
  }

  seleccionarProducto(productoSeleccionado: Producto) {
    this.producto = { ...productoSeleccionado };
    this.isEditing = true; // Activa el modo de edición
  }

  async modificarProducto() {
    if (!this.producto.id) {
      alert('Seleccione un producto para modificar.');
      return;
    }

    await this.productoService.modificarProducto(this.producto);
    this.getProductos();
    this.producto = new Producto(); // Limpia el formulario después de modificar
    this.isEditing = false; // Desactiva el modo de edición
  }

  async eliminarProducto(id: string) {
    await this.productoService.eliminarProducto({ id, descripcion: '', precio: 0 });
    this.getProductos();
  }

  // Nueva función para limpiar el formulario
  limpiarFormulario() {
    this.producto = new Producto(); // Limpia todos los campos del formulario
    this.isEditing = false; // Desactiva el modo de edición
  }
}

import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Producto } from '../models/producto.model';
import { first } from 'rxjs';
import { setDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private db: Firestore = inject(Firestore); // ✅ Inyecta Firestore correctamente

  constructor() {}

  getProductos() {
    const productosCollection = collection(this.db, 'productos');
    return collectionData(productosCollection, { idField: 'id' }).pipe(first());
  }
  agregarProducto(producto: Producto) {
    const productoId = String(producto.id); // Convertimos el ID a string
    const productoDoc = doc(this.db, 'productos', productoId); // Se usa el ID como string
  
    return setDoc(productoDoc, {
      descripcion: producto.descripcion,
      precio: producto.precio
    });
  }
  modificarProducto(producto: Producto) {
    const productoDoc = doc(this.db, 'productos', producto.id);
    return updateDoc(productoDoc, {
      descripcion: producto.descripcion,
      precio: producto.precio
    });
  }

  eliminarProducto(producto: Producto) {
    const productoDoc = doc(this.db, 'productos', producto.id);
    return deleteDoc(productoDoc);
  }
}

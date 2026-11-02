import Head from '../../components/head';
import { ArrowRight, ChevronLeft, ChevronRight, FileText, Menu, MessageCircle, Search, ShieldCheck, ShoppingCart, Truck, Wrench, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import './inicio.css';

/* ===== DATOS ===== */
const WHATSAPP = '51935428871';
const wa = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;

const menu = [
    { texto: 'Inicio', href: '#inicio' },
    { texto: 'Tienda', href: '/tienda' },
    { texto: 'Acerca de nosotros', href: '/brochure/g-services-brochure.pdf' },
    { texto: 'Contacto', href: '#contacto' },
];

const categorias = [
    { nombre: 'Comercial', imagen: '/categoria/comercial.jpg' },
    { nombre: 'Interiores', imagen: '/categoria/interiores.jpg' },
    { nombre: 'Exteriores', imagen: '/categoria/exterior.jpg' },
];

const nuevosProductos = [
    { imagen: '/newproducto/diferencial.jpg', nombre: 'Interruptor diferencial Bticino', descripcion: 'Protección segura para instalaciones eléctricas.' },
    { imagen: '/newproducto/tablero24.jpg', nombre: 'Tablero de 24 polos metálico', descripcion: 'Tablero resistente para proyectos eléctricos.' },
    { imagen: '/newproducto/cajaoctogonal.jpg', nombre: 'Caja octogonal', descripcion: 'Ideal para instalaciones y conexiones eléctricas.' },
];

const ventajas = [
    { icono: Truck, titulo: 'Envíos en Lima', texto: 'A obra o domicilio.' },
    { icono: Wrench, titulo: 'Asesoría técnica', texto: 'Te ayudamos a elegir.' },
    { icono: ShieldCheck, titulo: 'Marcas confiables', texto: 'Productos certificados.' },
    { icono: MessageCircle, titulo: 'Atención por WhatsApp', texto: 'Cotiza desde tu celular.' },
];

const pasos = [
    { icono: Search, titulo: 'Elige tus productos', texto: 'Explora el catálogo y compara precios por categoría, marca o ambiente.' },
    { icono: ShoppingCart, titulo: 'Agrégalos al carrito', texto: 'Indica la cantidad que necesitas de cada uno.' },
    { icono: FileText, titulo: 'Envía tu pedido', texto: 'Mándanos tu carrito por WhatsApp y te confirmamos stock y entrega.' },
];

const redes = [
    { href: 'https://www.facebook.com/share/18QVLnsBty/', img: '/img/redes/facebook.png', nombre: 'Facebook' },
    { href: 'https://www.tiktok.com/@punto_electric', img: '/img/redes/titok.png', nombre: 'TikTok' },
    { href: `https://wa.me/${WHATSAPP}`, img: '/img/redes/whatsapp.png', nombre: 'WhatsApp' },
];

const foco = 'foco';
const contenedor = 'contenedor';
const botonAmarillo = `boton-amarillo ${foco}`;

/* Aparece suavemente al entrar en pantalla (respeta "reducir movimiento") */
function Aparecer({ children, retraso = 0, className = '' }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setVisible(true);
            return;
        }
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div ref={ref} style={{ transitionDelay: `${retraso}ms` }} className={`aparecer ${visible ? 'aparecer--visible' : 'aparecer--oculto'} ${className}`}>
            {children}
        </div>
    );
}

/* Carrusel de producto */
function CarruselProducto({ imagenes, nombre, descripcion }) {
    const [actual, setActual] = useState(0);
    const mover = (paso) => setActual((i) => (i + paso + imagenes.length) % imagenes.length);

    return (
        <article className="carrusel-producto">
            <div className="carrusel-producto__marco">
                <img src={imagenes[actual]} alt={`${nombre} - imagen ${actual + 1}`} loading="lazy" className="carrusel-producto__imagen" />
                {imagenes.length > 1 && (
                    <>
                        {[-1, 1].map((d) => (
                            <button
                                key={d}
                                type="button"
                                onClick={() => mover(d)}
                                className={`carrusel-producto__flecha ${foco} ${d < 0 ? 'carrusel-producto__flecha--izq' : 'carrusel-producto__flecha--der'}`}
                                aria-label={d < 0 ? 'Imagen anterior' : 'Imagen siguiente'}
                            >
                                {d < 0 ? <ChevronLeft className="icono-20" /> : <ChevronRight className="icono-20" />}
                            </button>
                        ))}
                        <div className="carrusel-producto__puntos">
                            {imagenes.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActual(i)}
                                    className={`carrusel-producto__punto ${i === actual ? 'carrusel-producto__punto--activo' : 'carrusel-producto__punto--inactivo'}`}
                                    aria-label={`Mostrar imagen ${i + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="tarjeta__cuerpo">
                <h3 className="tarjeta__titulo">{nombre}</h3>
                <p className="tarjeta__descripcion">{descripcion}</p>
                <a href={wa(`Hola, deseo cotizar el producto: ${nombre}`)} target="_blank" rel="noopener noreferrer" className={`tarjeta__whatsapp ${foco}`}>
                    <MessageCircle className="icono-16" /> Cotizar por WhatsApp
                </a>
            </div>
        </article>
    );
}

/* ===== PÁGINA ===== */
export default function Inicio() {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const [compacto, setCompacto] = useState(false);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const f = () => setCompacto(window.scrollY > 40);
        f();
        window.addEventListener('scroll', f, { passive: true });
        return () => window.removeEventListener('scroll', f);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuAbierto ? 'hidden' : '';
        const cerrar = (e) => e.key === 'Escape' && setMenuAbierto(false);
        window.addEventListener('keydown', cerrar);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', cerrar);
        };
    }, [menuAbierto]);

    const buscar = (e) => {
        e.preventDefault();
        const t = busqueda.trim();
        window.location.href = t ? `/tienda?buscar=${encodeURIComponent(t)}` : '/tienda';
    };

    const esNosotros = (href) => href.endsWith('.pdf');

    return (
        <>
            <Head title="Punto Electric | Materiales eléctricos en Lima" />

            <div id="top" className="inicio">
                <div className="barra-descuento">10 % de descuento en tu primera compra</div>

                {/* MENÚ */}
                <header className={`cabecera ${compacto ? 'cabecera--compacta' : 'cabecera--normal'}`}>
                    <div className={`${contenedor} cabecera__contenido ${compacto ? 'cabecera__contenido--compacto' : 'cabecera__contenido--normal'}`}>
                        <a href="#inicio" className={`cabecera__marca ${foco}`}>
                            <img src="/img/logoelectrico.jpg" alt="Logo Punto Electric" className={`cabecera__logo ${compacto ? 'cabecera__logo--compacto' : 'cabecera__logo--normal'}`} />
                            <div>
                                <p className="cabecera__nombre">
                                    PUNTO <span className="texto-amarillo">ELECTRIC</span>
                                </p>
                                <p className="cabecera__lema">Soluciones eléctricas</p>
                            </div>
                        </a>

                        <nav className="cabecera__menu">
                            {menu.map((item) => (
                                <a
                                    key={item.texto}
                                    href={item.href}
                                    target={esNosotros(item.href) ? '_blank' : undefined}
                                    rel={esNosotros(item.href) ? 'noopener noreferrer' : undefined}
                                    className={`menu-enlace ${item.href === '#inicio' ? 'menu-enlace--activo' : 'menu-enlace--normal'} ${foco}`}
                                >
                                    {item.texto}
                                </a>
                            ))}
                        </nav>

                        <div className="cabecera__acciones">
                            <form onSubmit={buscar} role="search" className="buscador">
                                <input
                                    type="search"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    placeholder="Buscar producto"
                                    aria-label="Buscar producto"
                                    className="buscador__input"
                                />
                                <button type="submit" aria-label="Buscar" className="buscador__boton">
                                    <Search className="icono-16" />
                                </button>
                            </form>
                            <button type="button" onClick={() => setMenuAbierto(true)} className={`boton-menu ${foco}`} aria-label="Abrir menú" aria-expanded={menuAbierto}>
                                <Menu className="icono-20" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* MENÚ CELULAR */}
                <div className={`menu-movil ${menuAbierto ? 'menu-movil--abierto' : 'menu-movil--cerrado'}`} role="dialog" aria-label="Menú" aria-hidden={!menuAbierto}>
                    <div className="menu-movil__cabecera">
                        <p className="menu-movil__titulo">
                            PUNTO <span className="texto-amarillo">ELECTRIC</span>
                        </p>
                        <button type="button" onClick={() => setMenuAbierto(false)} className={`menu-movil__cerrar ${foco}`} aria-label="Cerrar menú">
                            <X className="icono-24" />
                        </button>
                    </div>

                    <form onSubmit={buscar} role="search" className="menu-movil__buscador">
                        <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar producto" aria-label="Buscar producto" className="menu-movil__input" />
                        <button type="submit" aria-label="Buscar" className="menu-movil__boton-buscar">
                            <Search className="icono-20" />
                        </button>
                    </form>

                    <nav className="menu-movil__lista">
                        {menu.map((item, i) => (
                            <a
                                key={item.texto}
                                href={item.href}
                                target={esNosotros(item.href) ? '_blank' : undefined}
                                rel={esNosotros(item.href) ? 'noopener noreferrer' : undefined}
                                onClick={() => setMenuAbierto(false)}
                                style={{ transitionDelay: menuAbierto ? `${80 + i * 50}ms` : '0ms' }}
                                className={`menu-movil__enlace ${menuAbierto ? 'menu-movil__enlace--visible' : 'menu-movil__enlace--oculto'}`}
                            >
                                {item.texto}
                                <ArrowRight className="menu-movil__flecha" />
                            </a>
                        ))}
                    </nav>

                    <div className="menu-movil__pie">
                        <a href={wa('Hola, vengo de la página web.')} target="_blank" rel="noopener noreferrer" className="menu-movil__whatsapp">
                            <MessageCircle className="icono-20" /> Escríbenos por WhatsApp
                        </a>
                    </div>
                </div>

                <main>
                    {/* PORTADA */}
                    <section id="inicio" className={`${contenedor} portada`}>
                        <div className="portada__marco">
                            <img src="/img/imgprincipal.jpg" alt="" className="portada__fondo" />
                            <div className="portada__sombra-lateral" />
                            <div className="portada__sombra-inferior" />

                            <div className="portada__contenido">
                                <Aparecer>
                                    <p className="portada__etiqueta">
                                        <span className="portada__punto" />
                                        Materiales eléctricos y servicio técnico
                                    </p>
                                </Aparecer>
                                <Aparecer retraso={100}>
                                    <h1 className="portada__titulo">
                                        Material eléctrico para tu casa, negocio <span className="texto-amarillo">u obra</span>
                                    </h1>
                                </Aparecer>
                                <Aparecer retraso={200}>
                                    <p className="portada__texto">Productos confiables, precios competitivos y asesoría para que compres exactamente lo que tu instalación necesita.</p>
                                </Aparecer>
                                <Aparecer retraso={300}>
                                    <div className="portada__botones">
                                        <a href="/tienda" className={botonAmarillo}>
                                            Ver catálogo <ArrowRight className="icono-20" />
                                        </a>
                                        <a href={wa('Hola, quisiera una cotización.')} target="_blank" rel="noopener noreferrer" className={`portada__cotizar ${foco}`}>
                                            <MessageCircle className="icono-20" /> Cotizar por WhatsApp
                                        </a>
                                    </div>
                                </Aparecer>
                            </div>
                        </div>
                    </section>

                    {/* VENTAJAS: se monta sobre la portada */}
                    <section className={`${contenedor} ventajas`}>
                        <Aparecer>
                            <div className="ventajas__caja">
                                {ventajas.map(({ icono: Icono, titulo, texto }) => (
                                    <div key={titulo} className="fila-gap-3">
                                        <span className="ventajas__icono">
                                            <Icono className="icono-24" />
                                        </span>
                                        <div>
                                            <p className="ventajas__titulo">{titulo}</p>
                                            <p className="ventajas__texto">{texto}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Aparecer>
                    </section>

                    {/* CATEGORÍAS */}
                    <section className={`${contenedor} categorias`}>
                        <Aparecer>
                            <div className="categorias__encabezado">
                                <h2 className="titulo-seccion">
                                    Compra por <span className="texto-amarillo">ambiente</span>
                                </h2>
                                <a href="/tienda" className={`ver-todo ${foco}`}>
                                    Ver todo el catálogo <ArrowRight className="icono-16" />
                                </a>
                            </div>
                        </Aparecer>
                        <div className="grilla-tres">
                            {categorias.map((c, i) => (
                                <Aparecer key={c.nombre} retraso={i * 120}>
                                    <a href={`/tienda?ambiente=${c.nombre}`} className={`categoria ${foco}`}>
                                        <img src={c.imagen} alt="" loading="lazy" className="categoria__imagen" />
                                        <div className="categoria__degradado" />
                                        <div className="categoria__pie">
                                            <span className="categoria__nombre">{c.nombre}</span>
                                            <span className="categoria__flecha">
                                                <ArrowRight className="icono-20" />
                                            </span>
                                        </div>
                                    </a>
                                </Aparecer>
                            ))}
                        </div>
                    </section>

                    {/* PASOS */}
                    <section className="pasos">
                        <div className={contenedor}>
                            <Aparecer>
                                <h2 className="pasos__titulo">
                                    Haz tu pedido en <span className="texto-amarillo">3 pasos</span>
                                </h2>
                            </Aparecer>
                            <ol className="pasos__lista">
                                {pasos.map(({ icono: Icono, titulo, texto }, i) => (
                                    <li key={titulo}>
                                        <Aparecer retraso={i * 150} className="ocupa-alto">
                                            <div className="pasos__paso">
                                                <span className="pasos__numero">{i + 1}</span>
                                                <span className="pasos__icono">
                                                    <Icono className="icono-28" />
                                                </span>
                                                <h3 className="pasos__nombre">{titulo}</h3>
                                                <p className="pasos__texto">{texto}</p>
                                            </div>
                                        </Aparecer>
                                    </li>
                                ))}
                            </ol>
                            <Aparecer retraso={300}>
                                <a href="/tienda" className={`${botonAmarillo} pasos__boton`}>
                                    Empezar a elegir productos <ArrowRight className="icono-20" />
                                </a>
                            </Aparecer>
                        </div>
                    </section>

                    {/* NOVEDADES */}
                    <section id="tienda" className={`${contenedor} novedades`}>
                        <Aparecer>
                            <h2 className="titulo-seccion">
                                Recién <span className="texto-amarillo">llegados</span>
                            </h2>
                            <p className="novedades__subtitulo">Los productos que acabamos de incorporar a la tienda.</p>
                        </Aparecer>
                        <div className="grilla-tres">
                            {nuevosProductos.map((p, i) => (
                                <Aparecer key={p.nombre} retraso={i * 120} className="ocupa-alto">
                                    <article className="novedad">
                                        <span className="novedad__etiqueta">Nuevo</span>
                                        <div className="novedad__foto">
                                            <img src={p.imagen} alt={p.nombre} loading="lazy" className="novedad__imagen" />
                                        </div>
                                        <div className="tarjeta__cuerpo">
                                            <h3 className="tarjeta__titulo">{p.nombre}</h3>
                                            <p className="tarjeta__descripcion">{p.descripcion}</p>
                                            <a href={wa(`Hola, deseo cotizar el producto: ${p.nombre}`)} target="_blank" rel="noopener noreferrer" className={`novedad__boton ${foco}`}>
                                                <span className="novedad__boton-texto">Cotizar este producto</span>
                                            </a>
                                        </div>
                                    </article>
                                </Aparecer>
                            ))}
                        </div>
                    </section>

                    {/* MÁS VENDIDOS */}
                    <section className="vendidos">
                        <div className={`${contenedor} vendidos__contenido`}>
                            <Aparecer>
                                <h2 className="titulo-seccion">
                                    Lo más <span className="texto-amarillo">vendido</span>
                                </h2>
                                <p className="vendidos__texto">Los productos que más eligen nuestros clientes por su calidad y utilidad.</p>
                                <a href="/tienda" className={`vendidos__ver-todo ${foco}`}>
                                    Ver todos los productos <ArrowRight className="icono-16" />
                                </a>
                            </Aparecer>
                            <div className="vendidos__lista">
                                <Aparecer className="ocupa-alto">
                                    <CarruselProducto
                                        nombre="Foco LED de 3 tonos"
                                        descripcion="Luz cálida, fría y ámbar en un solo foco."
                                        imagenes={['/products2/candelabros/foco3tonos.jpg', '/products2/candelabros/frio.jpg', '/products2/candelabros/ambar.jpg']}
                                    />
                                </Aparecer>
                                <Aparecer retraso={120} className="ocupa-alto">
                                    <CarruselProducto
                                        nombre="Rollo de cinta LED RGB"
                                        descripcion="Luz de colores RGB, rollo de 100 metros con corte cada metro. Ideal para interiores."
                                        imagenes={[
                                            '/products2/candelabros/carrusel2/cintaledrgb.avif',
                                            '/products2/candelabros/carrusel2/cintaledrgb.jpg',
                                            '/products2/candelabros/carrusel2/rgbled.webp',
                                        ]}
                                    />
                                </Aparecer>
                            </div>
                        </div>
                    </section>
                </main>

                {/* PIE DE PÁGINA */}
                <footer id="contacto" className="pie">
                    <div aria-hidden="true" className="pie__franja" />
                    <div className={`${contenedor} pie__grilla`}>
                        <div>
                            <div className="fila-gap-3">
                                <div className="pie__logo-circulo">
                                    <img src="/img/logoelectrico.jpg" alt="Logo Punto Electric" className="pie__logo-img" />
                                </div>
                                <p className="tarjeta__titulo">
                                    PUNTO <span className="texto-amarillo">ELECTRIC</span>
                                </p>
                            </div>
                            <p className="pie__redes-titulo">Síguenos</p>
                            <div className="fila-gap-3">
                                {redes.map((r) => (
                                    <a key={r.nombre} href={r.href} target="_blank" rel="noopener noreferrer" aria-label={`Visitar ${r.nombre}`} className={`pie__red ${foco}`}>
                                        <img src={r.img} alt="" className="icono-red" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="pie__titulo-col">Información</h3>
                            <ul className="pie__lista">
                                <li>
                                    <a href="#inicio" className="pie__enlace">
                                        Inicio
                                    </a>
                                </li>
                                <li>
                                    <a href="/tienda" className="pie__enlace">
                                        Tienda
                                    </a>
                                </li>
                                <li>
                                    <a href="/brochure/g-services-brochure.pdf target=" rel="noopener noreferrer" className="pie__enlace">
                                        Acerca de nosotros
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="pie__titulo-col">Contáctanos</h3>
                            <ul className="pie__lista">
                                <li>
                                    <a href="mailto:ventasgservices@gmail.com" className="pie__correo">
                                        ventasgservices@gmail.com
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+51935428871" className="pie__enlace">
                                        +51 935 428 871
                                    </a>
                                </li>
                                <li>Lima, Perú</li>
                            </ul>
                            <a href={wa('Hola, quisiera hablar con un asesor.')} target="_blank" rel="noopener noreferrer" className={`pie__contactar ${foco}`}>
                                <MessageCircle className="icono-16" /> Hablar con un asesor
                            </a>
                        </div>
                    </div>
                    <div className="pie__legal">© 2026 Punto Electric. Todos los derechos reservados.</div>
                </footer>

                {/* WHATSAPP FLOTANTE */}
                <a href={wa('Hola, vengo de la página web.')} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp" className={`whatsapp-flotante ${foco}`}>
                    <img src="/img/redes/whatsapp.png" alt="" className="icono-red" />
                </a>
            </div>
        </>
    );
}

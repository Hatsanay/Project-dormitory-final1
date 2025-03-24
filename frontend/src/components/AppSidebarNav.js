import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import nav from '@/_nav.js';
import { CBadge, CNavGroup, CNavItem, CNavTitle, CSidebarNav } from '@coreui/vue';

import simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '');

const isActiveLink = (route, link) => {
  if (link === undefined) {
    return false;
  }

  if (route.hash === link) {
    return true;
  }

  const currentPath = normalizePath(route.path);
  const targetPath = normalizePath(link);

  return currentPath === targetPath;
};

const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) {
    return true;
  }

  if (item.items) {
    return item.items.some((child) => isActiveItem(route, child));
  }

  return false;
};

// ฟังก์ชันตรวจสอบสิทธิ์จาก index หลายๆ อัน
const hasPermission = (permissions, indexes) => {
  return indexes.some(index => permissions[index] === '1');
};

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  setup() {
    const route = useRoute();
    const firstRender = ref(true);
    const permissions = localStorage.getItem('permissions') || '';

    onMounted(() => {
      firstRender.value = false;
    });

    const renderItem = (item) => {
      // ตรวจสอบสิทธิ์ของรายการย่อยก่อนแสดง
      if (Array.isArray(item.permission_index)) {
        if (!hasPermission(permissions, item.permission_index)) {
          return null;
        }
      } else if (item.permission_index !== undefined && permissions[item.permission_index] !== '1') {
        return null;
      }

      // ตรวจสอบรายการย่อยใน CNavGroup
      if (item.items) {
        const visibleItems = item.items.map((child) => renderItem(child)).filter(Boolean);

        if (visibleItems.length === 0) {
          return null; // ถ้าทุกรายการย่อยไม่มีสิทธิ์ ก็ไม่แสดง CNavGroup
        }

        return h(
          CNavGroup,
          {
            as: 'div',
            compact: true,
            ...(firstRender.value && {
              visible: isActiveItem(route, item),
            }),
          },
          {
            togglerContent: () => [
              h(resolveComponent('CIcon'), {
                customClassName: 'nav-icon',
                name: item.icon,
              }),
              item.name,
            ],
            default: () => visibleItems,
          },
        );
      }

      // แสดงเมนูปกติ
      return item.to
        ? h(
            RouterLink,
            {
              to: item.to,
              custom: true,
            },
            {
              default: (props) =>
                h(
                  resolveComponent(item.component),
                  {
                    active: props.isActive,
                    as: 'div',
                    href: props.href,
                    onClick: () => props.navigate(),
                  },
                  {
                    default: () => [
                      item.icon
                        ? h(resolveComponent('CIcon'), {
                            customClassName: 'nav-icon',
                            name: item.icon,
                          })
                        : h('span', { class: 'nav-icon' }, h('span', { class: 'nav-icon-bullet' })),
                      item.name,
                      item.badge &&
                        h(
                          CBadge,
                          {
                            class: 'ms-auto',
                            color: item.badge.color,
                          },
                          {
                            default: () => item.badge.text,
                          },
                        ),
                    ],
                  },
                ),
            },
          )
        : h(
            resolveComponent(item.component),
            {
              as: 'div',
            },
            {
              default: () => item.name,
            },
          );
    };

    return () =>
      h(
        CSidebarNav,
        {
          as: simplebar,
        },
        {
          default: () => nav.map((item) => renderItem(item)),
        },
      );
  },
});

export { AppSidebarNav };
